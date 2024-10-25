function resistorBandSelect() {
    var t = $("#lbl-multiplier").text()
      , n = $("#lbl-tolerance").text()
      , e = $("#dropdown-bands").val();
    e == "4" ? ($("#select-number3").addClass("conversion-calculator-hide"),
    $("#band-number3").addClass("band-hide"),
    $("#select-ppm").addClass("conversion-calculator-hide"),
    $("#band-ppm").addClass("band-hide"),
    $("#lbl-multiplier").text(lblMultiplier3rd),
    $("#lbl-multiplier").prop("title", lblMultiplier3rd),
    $("#lbl-tolerance").text(lblTolerance4th),
    $("#lbl-tolerance").prop("title", lblTolerance4th)) : e == "5" ? ($("#select-number3").removeClass("conversion-calculator-hide"),
    $("#band-number3").removeClass("band-hide"),
    $("#select-ppm").addClass("conversion-calculator-hide"),
    $("#band-ppm").addClass("band-hide"),
    $("#lbl-multiplier").text(lblMultiplier4th),
    $("#lbl-multiplier").prop("title", lblMultiplier4th),
    $("#lbl-tolerance").text(lblTolerance55th),
    $("#lbl-tolerance").prop("title", lblTolerance55th)) : e == "6" && ($("#select-number3").removeClass("conversion-calculator-hide"),
    $("#band-number3").removeClass("band-hide"),
    $("#select-ppm").removeClass("conversion-calculator-hide"),
    $("#band-ppm").removeClass("band-hide"),
    $("#lbl-multiplier").text(lblMultiplier4th),
    $("#lbl-multiplier").prop("title", lblMultiplier4th),
    $("#lbl-tolerance").text(lblTolerance55th),
    $("#lbl-tolerance").prop("title", lblTolerance55th)),
    ga("send", "event", "Resistor Color Code Calculator Select Value", "Number of Bands", e),
    dataLayerFeatureFlagAvailable() && window.dataLayer.push({
        event: "resistor_calc_number_bands_selected"
    })
}

function tagResistorSelection(e, t, n) {
    if (ga("send", "event", "Resistor Color Code Calculator Select Value", $(t.target).prev().text(), n),
    dataLayerPushCallCheck($(t.target).prev().text())) {
        var s = $(t.target).prev().text();
        s.includes("1st") ? bandSelectedDataLayerCall("1st") : s.includes("2nd") ? bandSelectedDataLayerCall("2nd") : s.includes("3rd") ? bandSelectedDataLayerCall("3rd") : s.includes("4th") ? bandSelectedDataLayerCall("4th") : s.includes("5th") ? bandSelectedDataLayerCall("5th") : s.includes("6th") && bandSelectedDataLayerCall("6th")
    }
}
$(function() {
    if ($("#feedbackModal").on("show.bs.modal", function() {
        typeof grecaptcha != "undefined" && grecaptcha.reset(),
        $("#divSubmitFailure").addClass("hidden"),
        $("#divSubmitSuccess").addClass("hidden"),
        $("#divMain").removeClass("hidden"),
        $("#btnFeedbackSubmit").removeClass("hidden"),
        $("#FeedbackText").val(""),
        $("#EmailAddress").val(""),
        $("form").validate().resetForm()
    }),
    $("#feedbackForm").on("submit", function(e) {
        e.preventDefault();
        var n, s, t = !1;
        $("#divSubmitFailure").addClass("hidden"),
        $("#divSubmitSuccess").addClass("hidden"),
        n = typeof grecaptcha != "undefined" ? grecaptcha.getResponse() : "success",
        n == "" ? $("#CaptchaValidationMessage").removeClass("hidden") : ($("#CaptchaValidationMessage").addClass("hidden"),
        t = !0),
        t && $("#feedbackForm").valid() && (s = $('input[name="__RequestVerificationToken"]', "#feedbackForm").val(),
        $.ajax({
            type: "POST",
            dataType: "json",
            cache: !1,
            url: $("#feedbackForm").attr("action"),
            data: {
                __RequestVerificationToken: s,
                comments: encodeURIComponent($("#FeedbackText").val()),
                email: encodeURIComponent($("#EmailAddress").val()),
                referrerUrl: encodeURIComponent($("#ReferrerUrl").val()),
                calculatorName: encodeURIComponent($("#CalculatorName").val()),
                englishCalculatorName: encodeURIComponent($("#EnglishCalculatorName").val())
            },
            success: function(e) {
                e.success ? ($("#divMain").addClass("hidden"),
                $("#divSubmitSuccess").removeClass("hidden"),
                $("#divSubmitSuccess").html(e.message),
                $("#btnFeedbackSubmit").addClass("hidden")) : ($("#divSubmitFailure").removeClass("hidden"),
                $("#divSubmitFailure").html(e.message))
            },
            error: function(e, t, n) {
                $("#divSubmitFailure").removeClass("hidden"),
                $("#divSubmitFailure").html(n)
            }
        }))
    }),
    $(".pnl-Calculate-Resistor").length > 0) {
        $(".tooltip-wrapper").tooltip({
            position: "bottom"
        });
        var t = dataLayerFeatureFlagAvailable()
          , e = function(e) {
            var t, e = e || {};
            e.multiplier ? this.options = multiplierOptions : e.tolerance ? this.options = toleranceOptions : e.ppm ? this.options = ppmOptions : this.options = digitOptions,
            t = _.find(this.options, function(t) {
                return t.index == e.value
            }),
            this.value = ko.observable(t || this.options[0])
        }
          , n = function() {
            var s, o, i, a, n = this;
            this.numberBand1 = ko.observable(new e({
                value: -1
            })),
            this.numberBand2 = ko.observable(new e({
                value: -1
            })),
            this.numberBand3 = ko.observable(new e({
                value: -1
            })),
            this.multiplierBand = ko.observable(new e({
                value: -1,
                multiplier: !0
            })),
            this.toleranceBand = ko.observable(new e({
                value: -1,
                tolerance: !0
            })),
            this.ppmBand = ko.observable(new e({
                value: -1,
                ppm: !0
            })),
            this.bandCount = ko.observable("4"),
            this.nonkoResistorLink = "",
            this.displayMatchingProducts = ko.observable(!1),
            this.matchingProductsTooltip = ko.observable(noMatchingProducts),
            s = function(e) {
                dataLayerPushCallCheck(e) && window.dataLayer.push({
                    event: "resistor_calc_value_returned"
                });
                var t = " Ohms";
                return e / 1e6 >= 1 ? (t = " MOhms",
                e = e / 1e6) : e / 1e3 >= 1 && (t = " kOhms",
                e = e / 1e3),
                parseFloat(e < 1 ? e.toPrecision(3) : e.toFixed(3)) + t
            }
            ,
            this.calculateResistance = ko.computed(function() {
                if ($("#dropdown-bands").val() == "4" && n.numberBand1().value().value > -1 && n.numberBand2().value().value > -1 && n.multiplierBand().value().value > -1 && n.toleranceBand().value().value > -1) {
                    ga("send", "event", "Resistor Color Code Calculator Calculation", "4", n.numberBand1().value().enUsText + "|" + n.numberBand2().value().enUsText + "|" + n.multiplierBand().value().enUsText + "|" + n.toleranceBand().value().enUsText);
                    var e = (n.numberBand1().value().value * 10 + n.numberBand2().value().value) * n.multiplierBand().value().value;
                    return s(e) + " " + n.toleranceBand().value().value * 100 + "%"
                }
                return $("#dropdown-bands").val() == "5" && n.numberBand1().value().value > -1 && n.numberBand2().value().value > -1 && n.multiplierBand().value().value > -1 && n.toleranceBand().value().value > -1 && n.numberBand3().value().value > -1 ? (ga("send", "event", "Resistor Color Code Calculator Calculation", "5", n.numberBand1().value().enUsText + "|" + n.numberBand2().value().enUsText + "|" + n.numberBand3().value().enUsText + "|" + n.multiplierBand().value().enUsText + "|" + n.toleranceBand().value().enUsText),
                e = (n.numberBand1().value().value * 100 + n.numberBand2().value().value * 10 + n.numberBand3().value().value) * n.multiplierBand().value().value,
                s(e) + " " + n.toleranceBand().value().value * 100 + "%") : $("#dropdown-bands").val() == "6" && n.numberBand1().value().value > -1 && n.numberBand2().value().value > -1 && n.multiplierBand().value().value > -1 && n.toleranceBand().value().value > -1 && n.numberBand3().value().value > -1 && n.ppmBand().value().value > -1 ? (ga("send", "event", "Resistor Color Code Calculator Calculation", "6", n.numberBand1().value().enUsText + "|" + n.numberBand2().value().enUsText + "|" + n.numberBand3().value().enUsText + "|" + n.multiplierBand().value().enUsText + "|" + n.toleranceBand().value().enUsText + "|" + n.ppmBand().value().enUsText),
                e = (n.numberBand1().value().value * 100 + n.numberBand2().value().value * 10 + n.numberBand3().value().value) * n.multiplierBand().value().value,
                s(e) + " " + n.toleranceBand().value().value * 100 + "% " + n.ppmBand().value().value) : ""
            }, this),
            i = function() {
                n.nonkoResistorLink = "",
                n.displayMatchingProducts(!1),
                $.ajax({
                    url: "/technical-resources/conversion-calculators/GetResistorCalculatorSearchUrl",
                    data: {
                        resistorValues: n.calculateResistance(),
                        hasppm: n.bandCount() == "6"
                    },
                    success: function(e) {
                        e != null && e.length > 0 ? (n.nonkoResistorLink = e,
                        n.displayMatchingProducts(!0),
                        n.matchingProductsTooltip("")) : (n.nonkoResistorLink = "",
                        n.displayMatchingProducts(!1),
                        n.matchingProductsTooltip(noMatchingProducts))
                    },
                    error: function() {
                        n.nonkoResistorLink = "",
                        n.displayMatchingProducts(!1),
                        n.matchingProductsTooltip(noMatchingProducts)
                    }
                })
            }
            ,
            a = function() {
                t && window.dataLayer.push({
                    event: "resistor_calc_reset"
                });
                var e = "Number of Bands|"
                  , s = n.bandCount() + "|";
                e += "1st Band|",
                s += n.numberBand1().value().enUsText + "|",
                e += "2nd Band|",
                s += n.numberBand2().value().enUsText + "|",
                n.bandCount() == "4" ? (e += "Multiplier (3rd Band)|",
                s += n.multiplierBand().value().enUsText + "|",
                e += "Tolerance (4th Band)",
                s += n.toleranceBand().value().enUsText) : (n.bandCount() == "5" || n.bandCount() == "6") && (e += "3rd Band|",
                s += n.numberBand3().value().enUsText + "|",
                e += "Multiplier (4th Band)|",
                s += n.multiplierBand().value().enUsText + "|",
                e += "Tolerance (5th Band)",
                s += n.toleranceBand().value().enUsText),
                n.bandCount() == "6" && (e += "PPM (6th Band)|",
                s += n.ppmBand().value().enUsText),
                ga("send", "event", "Resistor Color Code Calculator Reset", e, s)
            }
            ,
            o = function(e) {
                var s = []
                  , o = "number of bands|1st band|2nd band|Multiplier(3rd band)|Tolerance(4th band)|resistor value";
                if (e === "Success" || e === "No Matching Products")
                    switch (n.bandCount()) {
                    case "4":
                        s.push(n.numberBand1().value().enUsText, n.numberBand2().value().enUsText, n.multiplierBand().value().enUsText, n.toleranceBand().value().enUsText),
                        i(n.bandCount(), s) && a(n.bandCount(), s, o);
                        break;
                    case "5":
                        s.push(n.numberBand1().value().enUsText, n.numberBand2().value().enUsText, n.numberBand3().value().enUsText, n.multiplierBand().value().enUsText, n.toleranceBand().value().enUsText),
                        o = o.replace("Multiplier(3rd band)|Tolerance(4th band)", "3rd band|Multiplier(4th band)|Tolerance(5th band)"),
                        i(n.bandCount(), s) && a(n.bandCount(), s, o);
                        break;
                    case "6":
                        s.push(n.numberBand1().value().enUsText, n.numberBand2().value().enUsText, n.numberBand3().value().enUsText, n.multiplierBand().value().enUsText, n.toleranceBand().value().enUsText, n.ppmBand().value().enUsText),
                        o = o.replace("Multiplier(3rd band)|Tolerance(4th band)", "3rd band|Multiplier(4th band)|Tolerance(5th band)|PPM(6th band)"),
                        i(n.bandCount(), s) && a(n.bandCount(), s, o);
                        break
                    }
                n.bandCount() == "4" ? ga("send", "event", "Resistor Color Code Calculator Display Products", e, "4|" + n.numberBand1().value().enUsText + "|" + n.numberBand2().value().enUsText + "|" + n.multiplierBand().value().enUsText + "|" + n.toleranceBand().value().enUsText) : n.bandCount() == "5" ? ga("send", "event", "Resistor Color Code Calculator Display Products", e, "5|" + n.numberBand1().value().enUsText + "|" + n.numberBand2().value().enUsText + "|" + n.numberBand3().value().enUsText + "|" + n.multiplierBand().value().enUsText + "|" + n.toleranceBand().value().enUsText) : n.bandCount() == "6" && ga("send", "event", "Resistor Color Code Calculator Display Products", e, "6|" + n.numberBand1().value().enUsText + "|" + n.numberBand2().value().enUsText + "|" + n.numberBand3().value().enUsText + "|" + n.multiplierBand().value().enUsText + "|" + n.toleranceBand().value().enUsText + "|" + n.ppmBand().value().enUsText);
                
            }
            ,
            this.calculateResistance.subscribe(i),
            this.resetValues = function(t, n) {
                n.target.id != "dropdown-bands" && a(),
                this.numberBand1(new e({
                    value: -1
                })),
                this.numberBand2(new e({
                    value: -1
                })),
                this.numberBand3(new e({
                    value: -1
                })),
                this.multiplierBand(new e({
                    value: -1,
                    multiplier: !0
                })),
                this.toleranceBand(new e({
                    value: -1,
                    tolerance: !0
                })),
                this.ppmBand(new e({
                    value: -1,
                    ppm: !0
                })),
                this.displayMatchingProducts(!1),
                this.matchingProductsTooltip(noMatchingProducts)
            }
            ,
            this.goToMatchingResistors = function() {
                this.nonkoResistorLink != "" && (window.open(this.nonkoResistorLink, "_blank"),
                o("Success"))
            }
            ,
            this.tagDisableClick = function() {
                n.displayMatchingProducts() || o("No Matching Products")
            }
            ,
            this.tagViewAllResistors = function() {
                return t && window.dataLayer.push({
                    event: "resistor_calc_view_all"
                }),
                o("View All Resistors"),
                !0
            }
        };
        ko.applyBindings(new n, document.getElementById("pnl-Calculate"))
    }
});
function dataLayerFeatureFlagAvailable() {
    return dataLayer !== "undefined" && isGa4CalculatorEnabled
}

var lastEntered = "None"
  , secondToLastEntered = "";

function dataLayerPushCallCheck(e) {
    return dataLayerFeatureFlagAvailable() && e !== null && e.length !== 0 && typeof e != "undefined"
}
