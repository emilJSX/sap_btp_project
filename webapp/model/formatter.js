sap.ui.define([], function() {
    "use strict";
    return {
        formatDate: function(sDate) {
            if (!sDate) {
                return "";
            }
            var oDate = new Date(sDate);
            var oOptions = {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            };
            var sFormattedDate = oDate.toLocaleDateString("en-GB", oOptions).replace(",", "");
            return sFormattedDate;
        }
    };
});