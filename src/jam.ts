'use strict';

type TypedObject = {
   [key: string]: any
}

type Options = {
   template: string,
   data: TypedObject,
   selector: string,
   kids: Array<Jam>
}

class Jam {

   private _template: string;
   private _data: TypedObject;
   private _selector: string;
   private _kids: Array<Jam>;

   constructor(options: Options) {
      this._template = options.template; 
      this._data = options.data; 
      this._selector = options.selector;
      this._kids = options.kids;
   }

   render (): void {
      const template: string = this._template; 
      const data: TypedObject = this._data; 
      const selector: string = this._selector;
      const kids: Array<Jam> = this._kids;
      const dom: Node = document.querySelector(selector);
      const shadow: DocumentFragment = document.createRange().createContextualFragment(this._renderTemplate(template, data));
      
      dom.normalize();
      this._clean(dom);
      
      this._renderKids(shadow, data, kids); 
      shadow.normalize();
      this._clean(shadow);
      
      this._renderDom(dom, dom.childNodes, shadow.childNodes);
   }

   update (newData: TypedObject) : TypedObject {
      this._data = this._copy({}, [this._data, newData]);
      this.render();
      return this._data;
   }

   _renderKids (shadow: DocumentFragment, parentData: TypedObject, kids: Array<Jam>) {
      for (let i = 0; i < kids.length; i++) {
         const kid: Jam = kids[i];
         const combinedData: TypedObject = this._copy({}, [parentData, kid._data]);
         const kidShadow: DocumentFragment = document.createRange().createContextualFragment(this._renderTemplate(kid._template, combinedData));
         shadow.querySelector(kid._selector).appendChild(kidShadow);
         this._renderKids(shadow, combinedData, kid._kids);
      }
   }   

   _renderTemplate (template: string, data: TypedObject): string {
     
      const interpolate: RegExp = /<%=([\s\S]+?)%>/g;
      const escape: RegExp = /<%-([\s\S]+?)%>/g;
      const evaluate: RegExp = /<%([\s\S]+?)%>/g;

      let f: string = "";
      f += "var str = '';\n";   
                     
      template = template.replace(/\n/g, '')
                         .replace(interpolate, "' + $1 + '") 
                         .replace(escape, "' + this._escape($1) + '") 
                         .replace(evaluate, "'; $1 str += '"); 
      f += "str +='" + template + "';\n";
      f += "return str;\n";

      const func: any = new Function('data', f);
      const html: string = func.call(this, data);

      return html; 
   }

   _renderDom (dom: Node, domNodes: NodeList, shadowNodes: NodeList): void {
      const domNodesArray: Array<Node> = Array.prototype.slice.call(domNodes);
      const shadowNodesArray: Array<Node> = Array.prototype.slice.call(shadowNodes);
      for (let i = 0; i < Math.max(domNodesArray.length, shadowNodesArray.length); i++) {
         const domNode: Node = domNodesArray[i];
         const shadowNode: Node = shadowNodesArray[i];
         if (domNode === undefined) {
            dom.appendChild(shadowNode);
         } else if (shadowNode === undefined) {
            dom.removeChild(domNode);
         } else if (this._changed(<Element>domNode, <Element>shadowNode) === true) { 
            dom.replaceChild(shadowNode, domNode);
         } else {
            this._renderDom(domNode, domNode.childNodes, shadowNode.childNodes);
         }
      }
   }

   _changed (d1: Element, d2: Element): boolean {
      if (d1.nodeType !== d2.nodeType) {
         return true;
      }
      if ((d1.nodeType === 3 && d2.nodeType === 3) &&
         (d1.textContent !== d2.textContent)) {
         return true;
      }
      if (d1.nodeName !== d2.nodeName) {
         return true;
      }
      const d1Attributes: NamedNodeMap = d1.attributes;     
      const d2Attributes: NamedNodeMap = d2.attributes;
      if (d1Attributes && d2Attributes) {
         for (let i = 0; i < d1Attributes.length; i++) {
            const d1Attribute: Attr = d1Attributes[i];
            const d2Attribute: Attr = d2Attributes.getNamedItem(d1Attribute.name);
            if (d1Attribute.value !== d2Attribute.value) {
               return true;
            }
         }     
      }
      if (d1Attributes && !d2Attributes) {
         return true;
      } 
      if (!d1Attributes && d2Attributes) {
         return true;
      } 
      return false;
   }

   _escape (html: string): string {
      const tmp: Element = document.createElement('div');
      tmp.appendChild(document.createTextNode(html));
      const escaped: string = tmp.innerHTML;
      return escaped; 
   }

   _clean (node: Node): void {
      for(let i = 0; i < node.childNodes.length; i++) {
         const child: Node = node.childNodes[i];
         if ((child.nodeType === 8) || 
             (child.nodeType === 3 && /^\s*$/.test(child.nodeValue))) {
            node.removeChild(child);
            i--;
         } else if(child.nodeType === 1) {
            this._clean(child);
         }
      }
   }

   _copy (to: TypedObject, from: Array<TypedObject>) {
      for (let i = 0; i < from.length; i++) {
         const object = from[i];
         for (let key in object) {
            to[key] = object[key];
         }
      }
      return to;
   }
}
