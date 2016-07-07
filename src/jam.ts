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
      const template = this._template; 
      const data = this._data; 
      const selector = this._selector;
      const kids = this._kids;
      const dom = document.querySelector(selector);
      const shadow = document.createRange().createContextualFragment(this._renderTemplate(template, data));
      
      dom.normalize();
      this._clean(dom);
      
      this._renderKids(shadow, kids); 
      shadow.normalize();
      this._clean(shadow);
      
      this._renderDom(dom, dom.childNodes, shadow.childNodes);
   }

   update (data: TypedObject) : TypedObject {
      for (let key in data) {
         this._data[key] = data[key];
      }
      this.render();
      return this._data;
   }

   _renderKids (shadow: DocumentFragment, kids: Array<Jam>) {
      for (let i = 0; i < kids.length; i++) {
         const kid = kids[i];
         const kidShadow = document.createRange().createContextualFragment(this._renderTemplate(kid._template, kid._data));
         shadow.querySelector(kid._selector)
         .appendChild(kidShadow);
         this._renderKids(shadow, kid._kids);
      }
   }   

   _renderTemplate (template: string, data: TypedObject): string {
     
      const _escape = function (html: string): string {
         var tmp = document.createElement('div');
         tmp.appendChild(document.createTextNode(html));
         var escaped = tmp.innerHTML;
         return escaped; 
      };

      const interpolate = /<%=([\s\S]+?)%>/g;
      const escape = /<%-([\s\S]+?)%>/g;
      const evaluate = /<%([\s\S]+?)%>/g;

      let f = "";
      f += "var str = '';\n";   
                     
      template = template.replace(/\n/g, '')
                         .replace(interpolate, "' + $1 + '") 
                         .replace(escape, "' + this._escape($1) + '") 
                         .replace(evaluate, "'; $1 str += '"); 
      f += "str +='" + template + "';\n";
      f += "return str;\n";

      const func = new Function('data', f);
      const scope = {
         _escape: _escape
      };
      const html = func.call(scope, data);

      return html; 
   }

   _renderDom (dom: Node, domNodes: NodeList, shadowNodes: NodeList): void {
      const domNodesArray = Array.prototype.slice.call(domNodes);
      const shadowNodesArray = Array.prototype.slice.call(shadowNodes);
      for (let i = 0; i < Math.max(domNodesArray.length, shadowNodesArray.length); i++) {
         const domNode = domNodesArray[i];
         const shadowNode = shadowNodesArray[i];
         if (domNode === undefined) {
            dom.appendChild(shadowNode);
         } else if (shadowNode === undefined) {
            dom.removeChild(domNode);
         } else if (this._changed(domNode, shadowNode) === true) { 
            dom.replaceChild(shadowNode, domNode);
         } else {
            this._renderDom(domNode, domNode.childNodes, shadowNode.childNodes);
         }
      }
   }

   _changed (d1: Node, d2: Node): boolean {
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
      // TODO more checks for eqaulity
      return false;
   }

   _clean (node: Node): void {
      for(let i = 0; i < node.childNodes.length; i++) {
         const child = node.childNodes[i];
         if ((child.nodeType === 8) || 
             (child.nodeType === 3 && /^\s*$/.test(child.nodeValue))) {
            node.removeChild(child);
            i--;
         } else if(child.nodeType === 1) {
            this._clean(child);
         }
      }
   }
}
