'use strict';
var Jam = (function () {
    function Jam(options) {
        this._template = options.template;
        this._data = options.data;
        this._selector = options.selector;
        this._functions = options.functions;
    }
    Jam.prototype.render = function () {
        this._render();
    };
    Jam.prototype.update = function (newData) {
        this._data = this._copy({}, [this._data, newData]);
        this._render();
        return this._data;
    };
    Jam.prototype._render = function () {
        var template = this._template;
        var data = this._data;
        var selector = this._selector;
        var dom = document.querySelector(selector);
        var shadow = document.createRange().createContextualFragment(this._renderTemplate(template, data));
        dom.normalize();
        this._clean(dom);
        shadow.normalize();
        this._clean(shadow);
        this._renderDom(dom, dom.childNodes, shadow.childNodes);
    };
    Jam.prototype._renderTemplate = function (template, data) {
        var interpolate = /<%=([\s\S]+?)%>/g;
        var escape = /<%-([\s\S]+?)%>/g;
        var evaluate = /<%([\s\S]+?)%>/g;
        var f = "";
        f += "var str = '';\n";
        template = template.replace(/\n/g, '')
            .replace(interpolate, "' + $1 + '")
            .replace(escape, "' + this._escape($1) + '")
            .replace(evaluate, "'; $1 str += '");
        f += "str +='" + template + "';\n";
        f += "return str;\n";
        var func = new Function('data', f);
        var html = func.call(this, data);
        return html;
    };
    Jam.prototype._renderDom = function (dom, domNodes, shadowNodes) {
        var domNodesArray = Array.prototype.slice.call(domNodes);
        var shadowNodesArray = Array.prototype.slice.call(shadowNodes);
        for (var i = 0; i < Math.max(domNodesArray.length, shadowNodesArray.length); i++) {
            var domNode = domNodesArray[i];
            var shadowNode = shadowNodesArray[i];
            if (domNode === undefined) {
                this._listen(shadowNode);
                dom.appendChild(shadowNode);
            }
            else if (shadowNode === undefined) {
                dom.removeChild(domNode);
            }
            else if (this._changed(domNode, shadowNode) === true) {
                this._listen(shadowNode);
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
                node.addEventListener(evt, this._functions[func].bind(this), false);
            }
        }
    };
    Jam.prototype._clean = function (node) {
        for (var i = 0; i < node.childNodes.length; i++) {
            var child = node.childNodes[i];
            if ((child.nodeValue === null) ||
                (child.nodeType === 8) ||
                (child.nodeType === 3 && /^\s*$/.test(child.nodeValue))) {
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
    Jam.prototype._copy = function (to, from) {
        for (var i = 0; i < from.length; i++) {
            var object = from[i];
            for (var key in object) {
                to[key] = object[key];
            }
        }
        return to;
    };
    return Jam;
}());
//# sourceMappingURL=jam.js.map