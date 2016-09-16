'use strict';
var Jam = (function () {
    function Jam(options) {
        this._template = options.template;
        this._data = options.data;
        this._selector = options.selector;
        this._functions = {};
        var keys = Object.keys(options.functions);
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            this._functions[key] = options.functions[key].bind(this);
        }
    }
    Object.defineProperty(Jam.prototype, "data", {
        get: function () {
            return this._data;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Jam.prototype, "functions", {
        get: function () {
            return this._functions;
        },
        enumerable: true,
        configurable: true
    });
    Jam.prototype.render = function () {
        this._render();
    };
    Jam.prototype.update = function (newData) {
        this._data = this._merge(this._data, newData);
        this._render();
        return this._data;
    };
    Jam.prototype._render = function () {
        var template = this._template;
        var selector = this._selector;
        var dom = document.querySelector(selector);
        var shadow = document.createRange().createContextualFragment(this._renderTemplate(template));
        dom.normalize();
        this._clean(dom);
        shadow.normalize();
        this._clean(shadow);
        this._renderDom(dom, dom.childNodes, shadow.childNodes);
    };
    Jam.prototype._renderTemplate = function (template) {
        var interpolate = /<%=([\s\S]+?)%>/g;
        var escape = /<%-([\s\S]+?)%>/g;
        var cleanEvaluate = /<%([\s\S]+?)%>\s*<%([\s\S]+?)%>/g;
        var evaluate = /<%([\s\S]+?)%>/g;
        var f = "";
        f += "var str = '';\n";
        template = template.replace(/\n/g, '')
            .replace(interpolate, "' + this.data.$1 || $1 + '")
            .replace(escape, "' + this._escape(this.data.$1 || $1) + '");
        while (cleanEvaluate.test(template)) {
            template = template.replace(cleanEvaluate, "<% $1 $2 %>");
        }
        template = template.replace(evaluate, "'; $1 str += '")
            .replace(/this.data.\s/g, 'this.data.');
        f += "str +='" + template + "';\n";
        f += "return str;\n";
        console.log(f);
        var func = new Function(f);
        var html = func.call(this);
        return html;
    };
    Jam.prototype._renderDom = function (dom, domNodes, shadowNodes) {
        var domNodesArray = Array.prototype.slice.call(domNodes);
        var shadowNodesArray = Array.prototype.slice.call(shadowNodes);
        for (var i = 0; i < Math.max(domNodesArray.length, shadowNodesArray.length); i++) {
            var domNode = domNodesArray[i];
            var shadowNode = shadowNodesArray[i];
            if (shadowNode) {
                this._listen(shadowNode);
            }
            if (!domNode) {
                dom.appendChild(shadowNode);
            }
            else if (!shadowNode) {
                dom.removeChild(domNode);
            }
            else if (this._changed(domNode, shadowNode) === true) {
                dom.replaceChild(shadowNode, domNode);
            }
            else {
                this._renderDom(domNode, domNode.childNodes, shadowNode.childNodes);
            }
        }
    };
    Jam.prototype._changed = function (d1, d2) {
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
        var d1Attributes = d1.attributes;
        var d2Attributes = d2.attributes;
        if (d1Attributes && d2Attributes) {
            if (d1Attributes.length !== d2Attributes.length) {
                return true;
            }
            for (var i = 0; i < d1Attributes.length; i++) {
                var d1Attribute = d1Attributes[i];
                var d2Attribute = d2Attributes.getNamedItem(d1Attribute.name);
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
    };
    Jam.prototype._listen = function (node) {
        var attributes = node.attributes;
        if (!attributes) {
            return;
        }
        for (var i = 0; i < attributes.length; i++) {
            var attribute = attributes[i];
            if (attribute.name.indexOf('on') != -1) {
                node.removeAttribute(attribute.name);
                var evt = attribute.name.replace('on', '');
                var func = attribute.value;
                node.addEventListener(evt, this._functions[func], false);
            }
        }
    };
    Jam.prototype._clean = function (node) {
        for (var i = 0; i < node.childNodes.length; i++) {
            var child = node.childNodes[i];
            if ((child.nodeType === 8) ||
                (child.nodeType === 3 &&
                    (child.nodeValue === null || /^\s*$/.test(child.nodeValue)))) {
                node.removeChild(child);
                i--;
            }
            else if (child.nodeType === 1) {
                this._clean(child);
            }
        }
    };
    Jam.prototype._escape = function (html) {
        var tmp = document.createElement('div');
        tmp.appendChild(document.createTextNode(html));
        var escaped = tmp.innerHTML;
        return escaped;
    };
    Jam.prototype._merge = function (a, b) {
        var c = {};
        var aKeys = Object.keys(a);
        for (var i = 0; i < aKeys.length; i++) {
            var key = aKeys[i];
            var value = a[key];
            if (typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
                c[key] = this._merge(c[key] || {}, a[key]);
            }
            else {
                c[key] = a[key];
            }
        }
        var bKeys = Object.keys(b);
        for (var i = 0; i < bKeys.length; i++) {
            var key = bKeys[i];
            var value = b[key];
            if (typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
                c[key] = this._merge(c[key] || {}, b[key]);
            }
            else {
                c[key] = b[key];
            }
        }
        return c;
    };
    return Jam;
}());
//# sourceMappingURL=jam.js.map