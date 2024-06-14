sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "../model/formatter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], function (Controller, JSONModel, formatter, Filter, FilterOperator, MessageBox, MessageToast) {
    "use strict"

    return Controller.extend("sap.ui.demo.walkthrough.controller.InvoiceList", {
        formatter: formatter,
        onInit: function () {
            var oModel = new sap.ui.model.json.JSONModel("http://localhost:3000/api/users");
            this.getView().setModel(oModel, "users");
            var oModel = new JSONModel({
                username: "",
                email: ""
            });
            this.getView().setModel(oModel, "user");

            var oListModel = new JSONModel();
            this.getView().setModel(oListModel, "user");

            this._loadListData();
        },

        _loadListData: function () {
            var oListModel = this.getView().getModel("user");
            oListModel.loadData("http://localhost:3000/api/users"); 
        },

        onChangePressed: function (oEvent) {
            var userId = oEvent.getSource().getBindingContext("user").getProperty("id");
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("editUser", {
                userId: userId
            });
        },

        onClickToCreationUser: function() {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("userCreation");
        },

        onFilterInvoices: function (oEvent) {

            var aFilter = [];
            var sQuery = oEvent.getParameter("query");
            if (sQuery) {
                aFilter.push(new Filter("ProductName", FilterOperator.Contains, sQuery));
            }

            var oList = this.byId("invoiceList");
            var oBinding = oList.getBinding("items");
            oBinding.filter(aFilter);
        },
        onPress: function () {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("detail");
        },  

    })
})