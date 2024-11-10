/*!
 * jQuery Validation Plugin v1.20.0
 *
 * https://jqueryvalidation.org/
 *
 * Copyright (c) 2023 Jörn Zaefferer
 * Released under the MIT license
 */
(function(e) {
    typeof define == "function" && define.amd ? define(["jquery"], e) : typeof module == "object" && module.exports ? module.exports = e(require("jquery")) : e(jQuery)
}
)(function(e) {
    e.extend(e.fn, {
        validate: function(t) {
            if (!this.length) {
                t && t.debug && window.console && console.warn("Nothing selected, can't validate, returning nothing.");
                return
            }
            var n = e.data(this[0], "validator");
            return n || (this.attr("novalidate", "novalidate"),
            n = new e.validator(t,this[0]),
            e.data(this[0], "validator", n),
            n.settings.onsubmit && (this.on("click.validate", ":submit", function(t) {
                n.submitButton = t.currentTarget,
                e(this).hasClass("cancel") && (n.cancelSubmit = !0),
                e(this).attr("formnovalidate") !== void 0 && (n.cancelSubmit = !0)
            }),
            this.on("submit.validate", function(t) {
                n.settings.debug && t.preventDefault();
                function s() {
                    var s, o;
                    return n.submitButton && (n.settings.submitHandler || n.formSubmitted) && (s = e("<input type='hidden'/>").attr("name", n.submitButton.name).val(e(n.submitButton).val()).appendTo(n.currentForm)),
                    !n.settings.submitHandler || !!n.settings.debug || (o = n.settings.submitHandler.call(n, n.currentForm, t),
                    s && s.remove(),
                    o !== void 0 && o)
                }
                return n.cancelSubmit ? (n.cancelSubmit = !1,
                s()) : n.form() ? n.pendingRequest ? (n.formSubmitted = !0,
                !1) : s() : (n.focusInvalid(),
                !1)
            })),
            n)
        },
        valid: function() {
            var t, n, s;
            return e(this[0]).is("form") ? t = this.validate().form() : (s = [],
            t = !0,
            n = e(this[0].form).validate(),
            this.each(function() {
                t = n.element(this) && t,
                t || (s = s.concat(n.errorList))
            }),
            n.errorList = s),
            t
        },
        rules: function(t, n) {
            var o, i, a, r, c, l, s = this[0], d = typeof this.attr("contenteditable") != "undefined" && this.attr("contenteditable") !== "false";
            if (s == null)
                return;
            if (!s.form && d && (s.form = this.closest("form")[0],
            s.name = this.attr("name")),
            s.form == null)
                return;
            if (t)
                switch (a = e.data(s.form, "validator").settings,
                c = a.rules,
                i = e.validator.staticRules(s),
                t) {
                case "add":
                    e.extend(i, e.validator.normalizeRule(n)),
                    delete i.messages,
                    c[s.name] = i,
                    n.messages && (a.messages[s.name] = e.extend(a.messages[s.name], n.messages));
                    break;
                case "remove":
                    return n ? (l = {},
                    e.each(n.split(/\s/), function(e, t) {
                        l[t] = i[t],
                        delete i[t]
                    }),
                    l) : (delete c[s.name],
                    i)
                }
            return o = e.validator.normalizeRules(e.extend({}, e.validator.classRules(s), e.validator.attributeRules(s), e.validator.dataRules(s), e.validator.staticRules(s)), s),
            o.required && (r = o.required,
            delete o.required,
            o = e.extend({
                required: r
            }, o)),
            o.remote && (r = o.remote,
            delete o.remote,
            o = e.extend(o, {
                remote: r
            })),
            o
        }
    });
    var t, n, s = function(e) {
        return e.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "")
    };
    return e.extend(e.expr.pseudos || e.expr[":"], {
        blank: function(t) {
            return !s("" + e(t).val())
        },
        filled: function(t) {
            var n = e(t).val();
            return n !== null && !!s("" + n)
        },
        unchecked: function(t) {
            return !e(t).prop("checked")
        }
    }),
    e.validator = function(t, n) {
        this.settings = e.extend(!0, {}, e.validator.defaults, t),
        this.currentForm = n,
        this.init()
    }
    ,
    e.validator.format = function(t, n) {
        return arguments.length === 1 ? function() {
            var n = e.makeArray(arguments);
            return n.unshift(t),
            e.validator.format.apply(this, n)
        }
        : n === void 0 ? t : (arguments.length > 2 && n.constructor !== Array && (n = e.makeArray(arguments).slice(1)),
        n.constructor !== Array && (n = [n]),
        e.each(n, function(e, n) {
            t = t.replace(new RegExp("\\{" + e + "\\}","g"), function() {
                return n
            })
        }),
        t)
    }
    ,
    e.extend(e.validator, {
        defaults: {
            messages: {},
            groups: {},
            rules: {},
            errorClass: "error",
            pendingClass: "pending",
            validClass: "valid",
            errorElement: "label",
            focusCleanup: !1,
            focusInvalid: !0,
            errorContainer: e([]),
            errorLabelContainer: e([]),
            onsubmit: !0,
            ignore: ":hidden",
            ignoreTitle: !1,
            onfocusin: function(e) {
                this.lastActive = e,
                this.settings.focusCleanup && (this.settings.unhighlight && this.settings.unhighlight.call(this, e, this.settings.errorClass, this.settings.validClass),
                this.hideThese(this.errorsFor(e)))
            },
            onfocusout: function(e) {
                !this.checkable(e) && (e.name in this.submitted || !this.optional(e)) && this.element(e)
            },
            onkeyup: function(t, n) {
                var s = [16, 17, 18, 20, 35, 36, 37, 38, 39, 40, 45, 144, 225];
                if (n.which === 9 && this.elementValue(t) === "" || e.inArray(n.keyCode, s) !== -1)
                    return;
                (t.name in this.submitted || t.name in this.invalid) && this.element(t)
            },
            onclick: function(e) {
                e.name in this.submitted ? this.element(e) : e.parentNode.name in this.submitted && this.element(e.parentNode)
            },
            highlight: function(t, n, s) {
                t.type === "radio" ? this.findByName(t.name).addClass(n).removeClass(s) : e(t).addClass(n).removeClass(s)
            },
            unhighlight: function(t, n, s) {
                t.type === "radio" ? this.findByName(t.name).removeClass(n).addClass(s) : e(t).removeClass(n).addClass(s)
            }
        },
        setDefaults: function(t) {
            e.extend(e.validator.defaults, t)
        },
        messages: {
            required: "This field is required.",
            remote: "Please fix this field.",
            email: "Please enter a valid email address.",
            url: "Please enter a valid URL.",
            date: "Please enter a valid date.",
            dateISO: "Please enter a valid date (ISO).",
            number: "Please enter a valid number.",
            digits: "Please enter only digits.",
            equalTo: "Please enter the same value again.",
            maxlength: e.validator.format("Please enter no more than {0} characters."),
            minlength: e.validator.format("Please enter at least {0} characters."),
            rangelength: e.validator.format("Please enter a value between {0} and {1} characters long."),
            range: e.validator.format("Please enter a value between {0} and {1}."),
            max: e.validator.format("Please enter a value less than or equal to {0}."),
            min: e.validator.format("Please enter a value greater than or equal to {0}."),
            step: e.validator.format("Please enter a multiple of {0}.")
        },
        autoCreateRanges: !1,
        prototype: {
            init: function() {
                this.labelContainer = e(this.settings.errorLabelContainer),
                this.errorContext = this.labelContainer.length && this.labelContainer || e(this.currentForm),
                this.containers = e(this.settings.errorContainer).add(this.settings.errorLabelContainer),
                this.submitted = {},
                this.valueCache = {},
                this.pendingRequest = 0,
                this.pending = {},
                this.invalid = {},
                this.reset();
                var t, s = this.currentForm, o = this.groups = {};
                e.each(this.settings.groups, function(t, n) {
                    typeof n == "string" && (n = n.split(/\s/)),
                    e.each(n, function(e, n) {
                        o[n] = t
                    })
                }),
                t = this.settings.rules,
                e.each(t, function(n, s) {
                    t[n] = e.validator.normalizeRule(s)
                });
                function n(t) {
                    if (o = typeof e(this).attr("contenteditable") != "undefined" && e(this).attr("contenteditable") !== "false",
                    !this.form && o && (this.form = e(this).closest("form")[0],
                    this.name = e(this).attr("name")),
                    s !== this.form)
                        return;
                    var o, i = e.data(this.form, "validator"), a = "on" + t.type.replace(/^validate/, ""), n = i.settings;
                    n[a] && !e(this).is(n.ignore) && n[a].call(i, this, t)
                }
                e(this.currentForm).on("focusin.validate focusout.validate keyup.validate", ":text, [type='password'], [type='file'], select, textarea, [type='number'], [type='search'], [type='tel'], [type='url'], [type='email'], [type='datetime'], [type='date'], [type='month'], [type='week'], [type='time'], [type='datetime-local'], [type='range'], [type='color'], [type='radio'], [type='checkbox'], [contenteditable], [type='button']", n).on("click.validate", "select, option, [type='radio'], [type='checkbox']", n),
                this.settings.invalidHandler && e(this.currentForm).on("invalid-form.validate", this.settings.invalidHandler)
            },
            form: function() {
                return this.checkForm(),
                e.extend(this.submitted, this.errorMap),
                this.invalid = e.extend({}, this.errorMap),
                this.valid() || e(this.currentForm).triggerHandler("invalid-form", [this]),
                this.showErrors(),
                this.valid()
            },
            checkForm: function() {
                this.prepareForm();
                for (var e = 0, t = this.currentElements = this.elements(); t[e]; e++)
                    this.check(t[e]);
                return this.valid()
            },
            element: function(t) {
                var a, r, s = this.clean(t), n = this.validationTargetFor(s), o = this, i = !0;
                return n === void 0 ? delete this.invalid[s.name] : (this.prepareElement(n),
                this.currentElements = e(n),
                r = this.groups[n.name],
                r && e.each(this.groups, function(e, t) {
                    t === r && e !== n.name && (s = o.validationTargetFor(o.clean(o.findByName(e))),
                    s && s.name in o.invalid && (o.currentElements.push(s),
                    i = o.check(s) && i))
                }),
                a = this.check(n) !== !1,
                i = i && a,
                a ? this.invalid[n.name] = !1 : this.invalid[n.name] = !0,
                this.numberOfInvalids() || (this.toHide = this.toHide.add(this.containers)),
                this.showErrors(),
                e(t).attr("aria-invalid", !a)),
                i
            },
            showErrors: function(t) {
                if (t) {
                    var n = this;
                    e.extend(this.errorMap, t),
                    this.errorList = e.map(this.errorMap, function(e, t) {
                        return {
                            message: e,
                            element: n.findByName(t)[0]
                        }
                    }),
                    this.successList = e.grep(this.successList, function(e) {
                        return !(e.name in t)
                    })
                }
                this.settings.showErrors ? this.settings.showErrors.call(this, this.errorMap, this.errorList) : this.defaultShowErrors()
            },
            resetForm: function() {
                e.fn.resetForm && e(this.currentForm).resetForm(),
                this.invalid = {},
                this.submitted = {},
                this.prepareForm(),
                this.hideErrors();
                var t = this.elements().removeData("previousValue").removeAttr("aria-invalid");
                this.resetElements(t)
            },
            resetElements: function(e) {
                var t;
                if (this.settings.unhighlight)
                    for (t = 0; e[t]; t++)
                        this.settings.unhighlight.call(this, e[t], this.settings.errorClass, ""),
                        this.findByName(e[t].name).removeClass(this.settings.validClass);
                else
                    e.removeClass(this.settings.errorClass).removeClass(this.settings.validClass)
            },
            numberOfInvalids: function() {
                return this.objectLength(this.invalid)
            },
            objectLength: function(e) {
                var t, n = 0;
                for (t in e)
                    e[t] !== void 0 && e[t] !== null && e[t] !== !1 && n++;
                return n
            },
            hideErrors: function() {
                this.hideThese(this.toHide)
            },
            hideThese: function(e) {
                e.not(this.containers).text(""),
                this.addWrapper(e).hide()
            },
            valid: function() {
                return this.size() === 0
            },
            size: function() {
                return this.errorList.length
            },
            focusInvalid: function() {
                if (this.settings.focusInvalid)
                    try {
                        e(this.findLastActive() || this.errorList.length && this.errorList[0].element || []).filter(":visible").trigger("focus").trigger("focusin")
                    } catch {}
            },
            findLastActive: function() {
                var t = this.lastActive;
                return t && e.grep(this.errorList, function(e) {
                    return e.element.name === t.name
                }).length === 1 && t
            },
            elements: function() {
                var t = this
                  , n = {};
                return e(this.currentForm).find("input, select, textarea, [contenteditable]").not(":submit, :reset, :image, :disabled").not(this.settings.ignore).filter(function() {
                    var s = this.name || e(this).attr("name")
                      , o = typeof e(this).attr("contenteditable") != "undefined" && e(this).attr("contenteditable") !== "false";
                    return !s && t.settings.debug && window.console && console.error("%o has no name assigned", this),
                    o && (this.form = e(this).closest("form")[0],
                    this.name = s),
                    this.form === t.currentForm && !(s in n || !t.objectLength(e(this).rules())) && (n[s] = !0,
                    !0)
                })
            },
            clean: function(t) {
                return e(t)[0]
            },
            errors: function() {
                var t = this.settings.errorClass.split(" ").join(".");
                return e(this.settings.errorElement + "." + t, this.errorContext)
            },
            resetInternals: function() {
                this.successList = [],
                this.errorList = [],
                this.errorMap = {},
                this.toShow = e([]),
                this.toHide = e([])
            },
            reset: function() {
                this.resetInternals(),
                this.currentElements = e([])
            },
            prepareForm: function() {
                this.reset(),
                this.toHide = this.errors().add(this.containers)
            },
            prepareElement: function(e) {
                this.reset(),
                this.toHide = this.errorsFor(e)
            },
            elementValue: function(t) {
                var n, s, o = e(t), i = t.type, a = typeof o.attr("contenteditable") != "undefined" && o.attr("contenteditable") !== "false";
                return i === "radio" || i === "checkbox" ? this.findByName(t.name).filter(":checked").val() : i === "number" && typeof t.validity != "undefined" ? t.validity.badInput ? "NaN" : o.val() : (a ? n = o.text() : n = o.val(),
                i === "file" ? n.substr(0, 12) === "C:\\fakepath\\" ? n.substr(12) : (s = n.lastIndexOf("/"),
                s >= 0 ? n.substr(s + 1) : (s = n.lastIndexOf("\\"),
                s >= 0 ? n.substr(s + 1) : n)) : typeof n == "string" ? n.replace(/\r/g, "") : n)
            },
            check: function(t) {
                t = this.validationTargetFor(this.clean(t));
                var s, o, i, a, n = e(t).rules(), l = e.map(n, function(e, t) {
                    return t
                }).length, r = !1, c = this.elementValue(t);
                this.abortRequest(t),
                typeof n.normalizer == "function" ? a = n.normalizer : typeof this.settings.normalizer == "function" && (a = this.settings.normalizer),
                a && (c = a.call(t, c),
                delete n.normalizer);
                for (i in n) {
                    s = {
                        method: i,
                        parameters: n[i]
                    };
                    try {
                        if (o = e.validator.methods[i].call(this, c, t, s.parameters),
                        o === "dependency-mismatch" && l === 1) {
                            r = !0;
                            continue
                        }
                        if (r = !1,
                        o === "pending") {
                            this.toHide = this.toHide.not(this.errorsFor(t));
                            return
                        }
                        if (!o)
                            return this.formatAndAdd(t, s),
                            !1
                    } catch (e) {
                        throw this.settings.debug && window.console && console.log("Exception occurred when checking element " + t.id + ", check the '" + s.method + "' method.", e),
                        e instanceof TypeError && (e.message += ".  Exception occurred when checking element " + t.id + ", check the '" + s.method + "' method."),
                        e
                    }
                }
                if (r)
                    return;
                return this.objectLength(n) && this.successList.push(t),
                !0
            },
            customDataMessage: function(t, n) {
                return e(t).data("msg" + n.charAt(0).toUpperCase() + n.substring(1).toLowerCase()) || e(t).data("msg")
            },
            customMessage: function(e, t) {
                var n = this.settings.messages[e];
                return n && (n.constructor === String ? n : n[t])
            },
            findDefined: function() {
                for (var e = 0; e < arguments.length; e++)
                    if (arguments[e] !== void 0)
                        return arguments[e]
            },
            defaultMessage: function(t, n) {
                typeof n == "string" && (n = {
                    method: n
                });
                var s = this.findDefined(this.customMessage(t.name, n.method), this.customDataMessage(t, n.method), !this.settings.ignoreTitle && t.title || void 0, e.validator.messages[n.method], "<strong>Warning: No message defined for " + t.name + "</strong>")
                  , o = /\$?\{(\d+)\}/g;
                return typeof s == "function" ? s = s.call(this, n.parameters, t) : o.test(s) && (s = e.validator.format(s.replace(o, "{$1}"), n.parameters)),
                s
            },
            formatAndAdd: function(e, t) {
                var n = this.defaultMessage(e, t);
                this.errorList.push({
                    message: n,
                    element: e,
                    method: t.method
                }),
                this.errorMap[e.name] = n,
                this.submitted[e.name] = n
            },
            addWrapper: function(e) {
                return this.settings.wrapper && (e = e.add(e.parent(this.settings.wrapper))),
                e
            },
            defaultShowErrors: function() {
                var e, t, n;
                for (e = 0; this.errorList[e]; e++)
                    t = this.errorList[e],
                    this.settings.highlight && this.settings.highlight.call(this, t.element, this.settings.errorClass, this.settings.validClass),
                    this.showLabel(t.element, t.message);
                if (this.errorList.length && (this.toShow = this.toShow.add(this.containers)),
                this.settings.success)
                    for (e = 0; this.successList[e]; e++)
                        this.showLabel(this.successList[e]);
                if (this.settings.unhighlight)
                    for (e = 0,
                    n = this.validElements(); n[e]; e++)
                        this.settings.unhighlight.call(this, n[e], this.settings.errorClass, this.settings.validClass);
                this.toHide = this.toHide.not(this.toShow),
                this.hideErrors(),
                this.addWrapper(this.toShow).show()
            },
            validElements: function() {
                return this.currentElements.not(this.invalidElements())
            },
            invalidElements: function() {
                return e(this.errorList).map(function() {
                    return this.element
                })
            },
            showLabel: function(t, n) {
                var o, a, r, c, s = this.errorsFor(t), l = this.idOrName(t), i = e(t).attr("aria-describedby");
                s.length ? (s.removeClass(this.settings.validClass).addClass(this.settings.errorClass),
                this.settings && this.settings.escapeHtml ? s.text(n || "") : s.html(n || "")) : (s = e("<" + this.settings.errorElement + ">").attr("id", l + "-error").addClass(this.settings.errorClass),
                this.settings && this.settings.escapeHtml ? s.text(n || "") : s.html(n || ""),
                o = s,
                this.settings.wrapper && (o = s.hide().show().wrap("<" + this.settings.wrapper + "/>").parent()),
                this.labelContainer.length ? this.labelContainer.append(o) : this.settings.errorPlacement ? this.settings.errorPlacement.call(this, o, e(t)) : o.insertAfter(t),
                s.is("label") ? s.attr("for", l) : s.parents("label[for='" + this.escapeCssMeta(l) + "']").length === 0 && (a = s.attr("id"),
                i ? i.match(new RegExp("\\b" + this.escapeCssMeta(a) + "\\b")) || (i += " " + a) : i = a,
                e(t).attr("aria-describedby", i),
                c = this.groups[t.name],
                c && (r = this,
                e.each(r.groups, function(t, n) {
                    n === c && e("[name='" + r.escapeCssMeta(t) + "']", r.currentForm).attr("aria-describedby", s.attr("id"))
                })))),
                !n && this.settings.success && (s.text(""),
                typeof this.settings.success == "string" ? s.addClass(this.settings.success) : this.settings.success(s, t)),
                this.toShow = this.toShow.add(s)
            },
            errorsFor: function(t) {
                var s = this.escapeCssMeta(this.idOrName(t))
                  , o = e(t).attr("aria-describedby")
                  , n = "label[for='" + s + "'], label[for='" + s + "'] *";
                return o && (n = n + ", #" + this.escapeCssMeta(o).replace(/\s+/g, ", #")),
                this.errors().filter(n)
            },
            escapeCssMeta: function(e) {
                return e === void 0 ? "" : e.replace(/([\\!"#$%&'()*+,./:;<=>?@\[\]^`{|}~])/g, "\\$1")
            },
            idOrName: function(e) {
                return this.groups[e.name] || (this.checkable(e) ? e.name : e.id || e.name)
            },
            validationTargetFor: function(t) {
                return this.checkable(t) && (t = this.findByName(t.name)),
                e(t).not(this.settings.ignore)[0]
            },
            checkable: function(e) {
                return /radio|checkbox/i.test(e.type)
            },
            findByName: function(t) {
                return e(this.currentForm).find("[name='" + this.escapeCssMeta(t) + "']")
            },
            getLength: function(t, n) {
                switch (n.nodeName.toLowerCase()) {
                case "select":
                    return e("option:selected", n).length;
                case "input":
                    if (this.checkable(n))
                        return this.findByName(n.name).filter(":checked").length
                }
                return t.length
            },
            depend: function(e, t) {
                return !this.dependTypes[typeof e] || this.dependTypes[typeof e](e, t)
            },
            dependTypes: {
                boolean: function(e) {
                    return e
                },
                string: function(t, n) {
                    return !!e(t, n.form).length
                },
                function: function(e, t) {
                    return e(t)
                }
            },
            optional: function(t) {
                var n = this.elementValue(t);
                return !e.validator.methods.required.call(this, n, t) && "dependency-mismatch"
            },
            elementAjaxPort: function(e) {
                return "validate" + e.name
            },
            startRequest: function(t) {
                this.pending[t.name] || (this.pendingRequest++,
                e(t).addClass(this.settings.pendingClass),
                this.pending[t.name] = !0)
            },
            stopRequest: function(t, n) {
                this.pendingRequest--,
                this.pendingRequest < 0 && (this.pendingRequest = 0),
                delete this.pending[t.name],
                e(t).removeClass(this.settings.pendingClass),
                n && this.pendingRequest === 0 && this.formSubmitted && this.form() && this.pendingRequest === 0 ? (e(this.currentForm).trigger("submit"),
                this.submitButton && e("input:hidden[name='" + this.submitButton.name + "']", this.currentForm).remove(),
                this.formSubmitted = !1) : !n && this.pendingRequest === 0 && this.formSubmitted && (e(this.currentForm).triggerHandler("invalid-form", [this]),
                this.formSubmitted = !1)
            },
            abortRequest: function(t) {
                var n;
                this.pending[t.name] && (n = this.elementAjaxPort(t),
                e.ajaxAbort(n),
                this.pendingRequest--,
                this.pendingRequest < 0 && (this.pendingRequest = 0),
                delete this.pending[t.name],
                e(t).removeClass(this.settings.pendingClass))
            },
            previousValue: function(t, n) {
                return n = typeof n == "string" && n || "remote",
                e.data(t, "previousValue") || e.data(t, "previousValue", {
                    old: null,
                    valid: !0,
                    message: this.defaultMessage(t, {
                        method: n
                    })
                })
            },
            destroy: function() {
                this.resetForm(),
                e(this.currentForm).off(".validate").removeData("validator").find(".validate-equalTo-blur").off(".validate-equalTo").removeClass("validate-equalTo-blur").find(".validate-lessThan-blur").off(".validate-lessThan").removeClass("validate-lessThan-blur").find(".validate-lessThanEqual-blur").off(".validate-lessThanEqual").removeClass("validate-lessThanEqual-blur").find(".validate-greaterThanEqual-blur").off(".validate-greaterThanEqual").removeClass("validate-greaterThanEqual-blur").find(".validate-greaterThan-blur").off(".validate-greaterThan").removeClass("validate-greaterThan-blur")
            }
        },
        classRuleSettings: {
            required: {
                required: !0
            },
            email: {
                email: !0
            },
            url: {
                url: !0
            },
            date: {
                date: !0
            },
            dateISO: {
                dateISO: !0
            },
            number: {
                number: !0
            },
            digits: {
                digits: !0
            },
            creditcard: {
                creditcard: !0
            }
        },
        addClassRules: function(t, n) {
            t.constructor === String ? this.classRuleSettings[t] = n : e.extend(this.classRuleSettings, t)
        },
        classRules: function(t) {
            var n = {}
              , s = e(t).attr("class");
            return s && e.each(s.split(" "), function() {
                this in e.validator.classRuleSettings && e.extend(n, e.validator.classRuleSettings[this])
            }),
            n
        },
        normalizeAttributeRule: function(e, t, n, s) {
            /min|max|step/.test(n) && (t === null || /number|range|text/.test(t)) && (s = Number(s),
            isNaN(s) && (s = void 0)),
            s || s === 0 ? e[n] = s : t === n && t !== "range" && (e[t === "date" ? "dateISO" : n] = !0)
        },
        attributeRules: function(t) {
            var n, o, s = {}, i = e(t), a = t.getAttribute("type");
            for (o in e.validator.methods)
                o === "required" ? (n = t.getAttribute(o),
                n === "" && (n = !0),
                n = !!n) : n = i.attr(o),
                this.normalizeAttributeRule(s, a, o, n);
            return s.maxlength && /-1|2147483647|524288/.test(s.maxlength) && delete s.maxlength,
            s
        },
        dataRules: function(t) {
            var n, s, o = {}, i = e(t), a = t.getAttribute("type");
            for (n in e.validator.methods)
                s = i.data("rule" + n.charAt(0).toUpperCase() + n.substring(1).toLowerCase()),
                s === "" && (s = !0),
                this.normalizeAttributeRule(o, a, n, s);
            return o
        },
        staticRules: function(t) {
            var n = {}
              , s = e.data(t.form, "validator");
            return s.settings.rules && (n = e.validator.normalizeRule(s.settings.rules[t.name]) || {}),
            n
        },
        normalizeRules: function(t, n) {
            return e.each(t, function(s, o) {
                if (o === !1) {
                    delete t[s];
                    return
                }
                if (o.param || o.depends) {
                    var i = !0;
                    switch (typeof o.depends) {
                    case "string":
                        i = !!e(o.depends, n.form).length;
                        break;
                    case "function":
                        i = o.depends.call(n, n);
                        break
                    }
                    i ? t[s] = o.param === void 0 || o.param : (e.data(n.form, "validator").resetElements(e(n)),
                    delete t[s])
                }
            }),
            e.each(t, function(e, s) {
                t[e] = typeof s == "function" && e !== "normalizer" ? s(n) : s
            }),
            e.each(["minlength", "maxlength"], function() {
                t[this] && (t[this] = Number(t[this]))
            }),
            e.each(["rangelength", "range"], function() {
                var e;
                t[this] && (Array.isArray(t[this]) ? t[this] = [Number(t[this][0]), Number(t[this][1])] : typeof t[this] == "string" && (e = t[this].replace(/[[\]]/g, "").split(/[\s,]+/),
                t[this] = [Number(e[0]), Number(e[1])]))
            }),
            e.validator.autoCreateRanges && (t.min != null && t.max != null && (t.range = [t.min, t.max],
            delete t.min,
            delete t.max),
            t.minlength != null && t.maxlength != null && (t.rangelength = [t.minlength, t.maxlength],
            delete t.minlength,
            delete t.maxlength)),
            t
        },
        normalizeRule: function(t) {
            if (typeof t == "string") {
                var n = {};
                e.each(t.split(/\s/), function() {
                    n[this] = !0
                }),
                t = n
            }
            return t
        },
        addMethod: function(t, n, s) {
            e.validator.methods[t] = n,
            e.validator.messages[t] = s !== void 0 ? s : e.validator.messages[t],
            n.length < 3 && e.validator.addClassRules(t, e.validator.normalizeRule(t))
        },
        methods: {
            required: function(t, n, s) {
                if (!this.depend(s, n))
                    return "dependency-mismatch";
                if (n.nodeName.toLowerCase() === "select") {
                    var o = e(n).val();
                    return o && o.length > 0
                }
                return this.checkable(n) ? this.getLength(t, n) > 0 : t != null && t.length > 0
            },
            email: function(e, t) {
                return this.optional(t) || /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(e)
            },
            url: function(e, t) {
                return this.optional(t) || /^(?:(?:(?:https?|ftp):)?\/\/)(?:(?:[^\][?/<~#`!@$^&*()+=}|:";',>{ ]|%[0-9A-Fa-f]{2})+(?::(?:[^\][?/<~#`!@$^&*()+=}|:";',>{ ]|%[0-9A-Fa-f]{2})*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u00a1-\uffff][a-z0-9\u00a1-\uffff_-]{0,62})?[a-z0-9\u00a1-\uffff]\.)+(?:[a-z\u00a1-\uffff]{2,}\.?))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(e)
            },
            date: function() {
                var e = !1;
                return function(t, n) {
                    return e || (e = !0,
                    this.settings.debug && window.console && console.warn("The `date` method is deprecated and will be removed in version '2.0.0'.\nPlease don't use it, since it relies on the Date constructor, which\nbehaves very differently across browsers and locales. Use `dateISO`\ninstead or one of the locale specific methods in `localizations/`\nand `additional-methods.js`.")),
                    this.optional(n) || !/Invalid|NaN/.test(new Date(t).toString())
                }
            }(),
            dateISO: function(e, t) {
                return this.optional(t) || /^\d{4}[/-](0?[1-9]|1[012])[/-](0?[1-9]|[12][0-9]|3[01])$/.test(e)
            },
            number: function(e, t) {
                return this.optional(t) || /^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(e)
            },
            digits: function(e, t) {
                return this.optional(t) || /^\d+$/.test(e)
            },
            minlength: function(e, t, n) {
                var s = Array.isArray(e) ? e.length : this.getLength(e, t);
                return this.optional(t) || s >= n
            },
            maxlength: function(e, t, n) {
                var s = Array.isArray(e) ? e.length : this.getLength(e, t);
                return this.optional(t) || s <= n
            },
            rangelength: function(e, t, n) {
                var s = Array.isArray(e) ? e.length : this.getLength(e, t);
                return this.optional(t) || s >= n[0] && s <= n[1]
            },
            min: function(e, t, n) {
                return this.optional(t) || e >= n
            },
            max: function(e, t, n) {
                return this.optional(t) || e <= n
            },
            range: function(e, t, n) {
                return this.optional(t) || e >= n[0] && e <= n[1]
            },
            step: function(t, n, s) {
                var i, o = e(n).attr("type"), l = "Step attribute on input type " + o + " is not supported.", d = ["text", "number", "range"], u = new RegExp("\\b" + o + "\\b"), h = o && !u.test(d.join()), a = function(e) {
                    var t = ("" + e).match(/(?:\.(\d+))?$/);
                    return t ? t[1] ? t[1].length : 0 : 0
                }, r = function(e) {
                    return Math.round(e * Math.pow(10, i))
                }, c = !0;
                if (h)
                    throw new Error(l);
                return i = a(s),
                (a(t) > i || r(t) % r(s) !== 0) && (c = !1),
                this.optional(n) || c
            },
            equalTo: function(t, n, s) {
                var o = e(s);
                return this.settings.onfocusout && o.not(".validate-equalTo-blur").length && o.addClass("validate-equalTo-blur").on("blur.validate-equalTo", function() {
                    e(n).valid()
                }),
                t === o.val()
            },
            remote: function(t, n, s, o) {
                if (this.optional(n))
                    return "dependency-mismatch";
                o = typeof o == "string" && o || "remote";
                var i, r, c, a = this.previousValue(n, o);
                return this.settings.messages[n.name] || (this.settings.messages[n.name] = {}),
                a.originalMessage = a.originalMessage || this.settings.messages[n.name][o],
                this.settings.messages[n.name][o] = a.message,
                s = typeof s == "string" && {
                    url: s
                } || s,
                c = e.param(e.extend({
                    data: t
                }, s.data)),
                a.old === c ? a.valid : (a.old = c,
                i = this,
                this.startRequest(n),
                r = {},
                r[n.name] = t,
                e.ajax(e.extend(!0, {
                    mode: "abort",
                    port: this.elementAjaxPort(n),
                    dataType: "json",
                    data: r,
                    context: i.currentForm,
                    success: function(e) {
                        var r, c, l, s = e === !0 || e === "true";
                        i.settings.messages[n.name][o] = a.originalMessage,
                        s ? (l = i.formSubmitted,
                        i.toHide = i.errorsFor(n),
                        i.formSubmitted = l,
                        i.successList.push(n),
                        i.invalid[n.name] = !1,
                        i.showErrors()) : (r = {},
                        c = e || i.defaultMessage(n, {
                            method: o,
                            parameters: t
                        }),
                        r[n.name] = a.message = c,
                        i.invalid[n.name] = !0,
                        i.showErrors(r)),
                        a.valid = s,
                        i.stopRequest(n, s)
                    }
                }, s)),
                "pending")
            }
        }
    }),
    t = {},
    e.ajaxPrefilter ? e.ajaxPrefilter(function(n, s, o) {
        var i = n.port;
        n.mode === "abort" && (e.ajaxAbort(i),
        t[i] = o)
    }) : (n = e.ajax,
    e.ajax = function(s) {
        var i = ("mode"in s ? s : e.ajaxSettings).mode
          , o = ("port"in s ? s : e.ajaxSettings).port;
        return i === "abort" ? (e.ajaxAbort(o),
        t[o] = n.apply(this, arguments),
        t[o]) : n.apply(this, arguments)
    }
    ),
    e.ajaxAbort = function(e) {
        t[e] && (t[e].abort(),
        delete t[e])
    }
    ,
    e
})