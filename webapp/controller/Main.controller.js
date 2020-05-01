"use strict";

sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/m/MessageToast",
  "sap/m/MessageBox",
  "sap/ui/core/Fragment",
  "sap/ui/model/json/JSONModel"
], function (Controller, MessageToast, MessageBox, Fragment, JSONModel) {
  return Controller.extend("sap.ui.pedro.crud.controller.Main", {

    onInit: function (evt) {
      const me = this,
        view = me.getView();

      // me.getUsuarios();

      me.byId('btn_edit').setVisible(false);

      view.setModel(new JSONModel([{
        NAME: 'PEDRO',
        EMAIL: 'pedro@pedro.com.au'
      }, {
        NAME: 'DOMINIKA',
        EMAIL: 'dominika@dominika.com.au'
      }, {
        NAME: 'RAFAEL',
        EMAIL: 'rafaael@rafaael.com.au'
      }, {
        NAME: 'JESSICA',
        EMAIL: 'jessica@jessica.com.au'
      }, {
        NAME: 'CASSIANO',
        EMAIL: 'cassiano@cassiano.com.au'
      }]), "usuarios");

      view.setModel(me.getEmptyData(), "formUsuario");
    },

    getEmptyData: function () {
      return new JSONModel({
        NAME: '', EMAIL: ''
      });
    },

    getUsuarios: function () {
      const me = this,
        view = me.getView();

      view.setBusy(true);

      $.ajax({
        type: 'GET',
        url: '/XMII/Illuminator?QueryTemplate=Default/api/xctRead&Content-Type=text/json',
        contentType: "application/json; charset=utf-8"
      }).success(function (data) {
        if (!data.Rowsets.Rowset) {
          MessageBox.show(
            "Cannot find data. Try again.", {
            icon: MessageBox.Icon.ERROR,
            title: "Error"
          });
          return;
        }
        view.setModel(new JSONModel(data.Rowsets.Rowset[0].Row), "usuarios");
      })
        .error(function (err) {
          MessageBox.show(
            "Cannot find data. Try again.", {
            icon: MessageBox.Icon.ERROR,
            title: "Error"
          });
        })
        .complete(() => {
          view.setBusy(false);
        });
    },

    onAddButtonPress: function () {
      const me = this;

      me.getView().setModel(me.getEmptyData(), "formUsuario");
      me.openUsuarioWindow('add');
      me.byId('usuario_table').clearSelection();
      me.byId('btn_edit').setVisible(false);
      me.byId('btn_delete').setEnabled(false);
    },

    onEditButtonPress: function () {
      const me = this,
        userTable = me.byId('usuario_table');

      if (userTable.getSelectedIndices() && userTable.getSelectedIndices().length > 1) {
        MessageBox.show(
          "It is only possible edit one row!", {
          icon: MessageBox.Icon.ERROR,
          title: "Error"
        });
        userTable.clearSelection();

        return;
      }
      this.openUsuarioWindow('edit');
    },

    openUsuarioWindow: function (mode) {
      const me = this;

      me.editMode = (mode === 'edit');

      let titleWindow = mode === 'edit' ? 'Edit' : 'Create';

      if (me.byId('usuarioDialog')) {
        me.byId('usuarioDialog').open();
        me.byId('title_window').setText(`${titleWindow} User Form`);
        return;
      }

      Fragment.load({
        id: me.getView().getId(),
        name: "sap.ui.pedro.crud.view.UsuarioDialog",
        controller: this
      }).then(fragment => {
        me.oUserDialog = fragment;
        me.getView().addDependent(fragment);
        fragment.open();
        me.byId('title_window').setText(`${titleWindow} User Form`);
      });
    },

    onDeleteButtonPress: function () {
      const me = this;

      MessageBox.show(
        "Are you sure you want to delete this item?", {
        icon: MessageBox.Icon.WARNING,
        title: "Warning",
        actions: [MessageBox.Action.YES, MessageBox.Action.NO],
        emphasizedAction: MessageBox.Action.NO,
        onClose: oAction => {
          if (oAction === 'YES') {
            const data = me.getView().getModel('usuarios').getData(),
              removedRecords = me.byId('usuario_table').getSelectedIndices();

            let newData = data.filter((value, index) => !removedRecords.includes(index));
            me.getView().getModel('usuarios').setData(newData);
            me.byId('usuario_table').clearSelection();
            me.byId('btn_edit').setVisible(false);
          }
        }
      });
    },

    onCancelButtonPress: function () {
      this.oUserDialog.close();
    },

    onSaveButtonPress: function (event) {
      const me = this,
        view = this.getView(),
        data = view.getModel('usuarios').getData(),
        formData = view.getModel("formUsuario").getData();

      //TO DO - Bind ID to identify if is save/update

      me.oUserDialog.setBusy(true);

      if (me.editMode) {
        data.splice(me.byId('usuario_table').getSelectedIndex(), 1, formData);
      } else {
        data.push(formData);
      }

      view.getModel('usuarios').setData(data);

      me.oUserDialog.setBusy(false);
      me.oUserDialog.close();
    },

    onUsuarioRowSelectionChange: function (oEvent) {
      const me = this,
        view = me.getView(),
        parameters = oEvent.getParameters();

      let data;

      if (parameters.rowContext) {
        data = parameters.rowContext.getProperty();
        me.byId('btn_edit').setVisible(true);
        me.byId('btn_delete').setEnabled();
      } else {
        data = this.getEmptyData();
      }

      view.getModel("formUsuario").setData(data);
    }
  });
});