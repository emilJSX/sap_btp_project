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

    return Controller.extend("sap.ui.demo.walkthrough.controller.UsersList", {
        formatter: formatter,
        onInit: function () {
            var oModel = new sap.ui.model.json.JSONModel("http://127.0.0.1:8000/users");
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
            oListModel.loadData("http://127.0.0.1:8000/users"); 
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

        onPress: function () {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("detail");
        },  

    })
})