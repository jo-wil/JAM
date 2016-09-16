'use strict';

//export = Jam;

type Data = {
   [key: string]: any
}

type Funcs = {
   [key: string]: (evt: Event) => any
}

type Options = {
   template: string,
   data: Data,
   selector: string,
   functions: Funcs 
}

class Jam {

   private _template: string;
   private _data: Data;
   private _selector: string;
   private _functions: Funcs;

   public constructor (options: Options) {
      this._template = options.template; 
      this._data = options.data; 
      this._selector = options.selector;
      this._functions = {};
      const keys = Object.keys(options.functions);
      for (var i = 0; i < keys.length; i++) {
         const key = keys[i];
         this._functions[key] = options.functions[key].bind(this);
      }
   }

   public get data (): Data {
      return this._data;
   }

   public get functions (): Funcs {
      return this._functions;
   }

   public render (): void {
      this._render();
   }

   public update (newData: Data) : Data {
      this._data = this._merge(this._data, newData);
      this._render();
      return this._data;
   }

   private _render (): void {
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

   private _renderTemplate (template: string): string {
     
      const interpolate: RegExp = /<%=([\s\S]+?)%>/g;
      const escape: RegExp = /<%-([\s\S]+?)%>/g;
      const cleanEvaluate: RegExp = /<%([\s\S]+?)%>\s*<%([\s\S]+?)%>/g;
      const evaluate: RegExp = /<%([\s\S]+?)%>/g;

      let f: string = "";
      f += "var str = '';\n";   

               
      template = template.replace(/\n/g, '')
                         .replace(interpolate, 
                         "' + (function () { if (this.data.$1 === undefined) { return $1; } else { return this.data.$1; } }).call(this) + '") 
                         .replace(escape, 
                         "' + this._escape((function () { if (this.data.$1 === undefined) { return $1; } else { return this.data.$1; } }).call(this)) + '"); 
                     
      while(cleanEvaluate.test(template)) {
         template = template.replace(cleanEvaluate, "<% $1 $2 %>");
      }      

      template = template.replace(evaluate, "'; $1 str += '")
                         .replace(/this.data.\s/g, 'this.data.'); 
      
      f += "str +='" + template + "';\n";
      f += "return str;\n";

      const func: any = new Function(f);

      const html: string = func.call(this);

      return html;
   }

   private _renderDom (dom: Node, domNodes: NodeList, shadowNodes: NodeList): void {
      const domNodesArray: Array<Node> = Array.prototype.slice.call(domNodes);
      const shadowNodesArray: Array<Node> = Array.prototype.slice.call(shadowNodes);
      for (let i = 0; i < Math.max(domNodesArray.length, shadowNodesArray.length); i++) {
         const domNode: Node = domNodesArray[i];
         const shadowNode: Node = shadowNodesArray[i];
         if (shadowNode) {
            this._listen(shadowNode);
         }
         if (!domNode) {
            dom.appendChild(shadowNode);
         } else if (!shadowNode) {
            dom.removeChild(domNode);
         } else if (this._changed(<Element>domNode, <Element>shadowNode) === true) { 
            dom.replaceChild(shadowNode, domNode);
         } else {
            this._renderDom(domNode, domNode.childNodes, shadowNode.childNodes);
         }
      }
   }

   private _changed (d1: Element, d2: Element): boolean {
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
         if (d1Attributes.length !== d2Attributes.length) {
            return true;
         }
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

   private _listen(node: Node): void {
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
            node.addEventListener(evt, this._functions[func], false);
         }
      }
   }

   private _clean (node: Node): void {
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

   private _escape (html: string): string {
      const tmp: Element = document.createElement('div');
      tmp.appendChild(document.createTextNode(html));
      const escaped: string = tmp.innerHTML;
      return escaped; 
   }

   private _merge (a: Data, b: Data): Data {
      const c: Data = {};
      const aKeys = Object.keys(a);
      for (let i = 0; i < aKeys.length; i++) {
         const key = aKeys[i];
         const value = a[key];
         if (typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
            c[key] = this._merge(c[key] || {}, a[key]);
         } else {
            c[key] = a[key];
         }
      }
      const bKeys = Object.keys(b);
      for (let i = 0; i < bKeys.length; i++) {
         const key = bKeys[i];
         const value = b[key];
         if (typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
            c[key] = this._merge(c[key] || {}, b[key]);
         } else {
            c[key] = b[key];
         }
      }
      return c;
   }
}
