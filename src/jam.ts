'use strict';

type TypedObject = {
   [key: string]: any
}

type Options = {
   template: string,
   data: TypedObject,
   selector: string,
   functions: TypedObject
}

class Jam {

   private _template: string;
   private _data: TypedObject;
   private _selector: string;
   private _functions: TypedObject;

   constructor(options: Options) {
      this._template = options.template; 
      this._data = options.data; 
      this._selector = options.selector;
      this._functions = options.functions;
   }

   get data (): TypedObject {
      return this._data;
   }

   get functions (): TypedObject {
      return this._functions;
   }

   render (): void {
      this._render();
   }

   update (newData: TypedObject) : TypedObject {
      this._data = this._copy({}, [this._data, newData]);
      this._render();
      return this._data;
   }

   _render (): void {
      const template: string = this._template; 
      const selector: string = this._selector;
      const dom: Node = document.querySelector(selector);
      const shadow: DocumentFragment = document.createRange().createContextualFragment(this._renderTemplate(template));
     
      dom.normalize();
      this._clean(dom);
      
      shadow.normalize();
      this._clean(shadow);
     
      this._renderDom(dom, dom.childNodes, shadow.childNodes);
   }

   _renderTemplate (template: string): string {
     
      const interpolate: RegExp = /<%=([\s\S]+?)%>/g;
      const escape: RegExp = /<%-([\s\S]+?)%>/g;
      const evaluate: RegExp = /<%([\s\S]+?)%>/g;

      let f: string = "";
      f += "var str = '';\n";   
                     
      const renderedTemplate = template.replace(/\n/g, '')
                               .replace(interpolate, "' + this.data.$1 + '") 
                               .replace(escape, "' + this._escape(this.data.$1) + '") 
                               .replace(evaluate, "'; $1 str += '"); 
      f += "str +='" + renderedTemplate + "';\n";
      f += "return str;\n";

      const func: any = new Function(f);

      const html: string = func.call(this);

      return html; 
   }

   _renderDom (dom: Node, domNodes: NodeList, shadowNodes: NodeList): void {
      const domNodesArray: Array<Node> = Array.prototype.slice.call(domNodes);
      const shadowNodesArray: Array<Node> = Array.prototype.slice.call(shadowNodes);
      for (let i = 0; i < Math.max(domNodesArray.length, shadowNodesArray.length); i++) {
         const domNode: Node = domNodesArray[i];
         const shadowNode: Node = shadowNodesArray[i];
         if (domNode === undefined) {
            this._listen(shadowNode);
            dom.appendChild(shadowNode);
         } else if (shadowNode === undefined) {
            dom.removeChild(domNode);
         } else if (this._changed(<Element>domNode, <Element>shadowNode) === true) { 
            this._listen(shadowNode);
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

   _listen(node: Node): void {
      const attributes: NamedNodeMap = node.attributes;
      if (!attributes) {
         return;
      }
      for (let i = 0; i < attributes.length; i++) {
         const attribute = attributes[i];
         if (attribute.name.indexOf('on') != -1) {
            (<Element>node).removeAttribute(attribute.name);
            const evt = attribute.name.replace('on', '');
            const func = attribute.value;
            node.addEventListener(evt, this._functions[func].bind(this), false);
         }
      }
   }

   _clean (node: Node): void {
      for(let i = 0; i < node.childNodes.length; i++) {
         const child: Node = node.childNodes[i];
         if ((child.nodeType === 8) || 
             (child.nodeType === 3 && 
             (child.nodeValue === null || /^\s*$/.test(child.nodeValue)))) {
            node.removeChild(child);
            i--;
         } else if(child.nodeType === 1) {
            this._clean(child);
         }
      }
   }

   _escape (html: string): string {
      const tmp: Element = document.createElement('div');
      tmp.appendChild(document.createTextNode(html));
      const escaped: string = tmp.innerHTML;
      return escaped; 
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
