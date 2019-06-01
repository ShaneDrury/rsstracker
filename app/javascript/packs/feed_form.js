import "core-js/stable";
import "regenerator-runtime/runtime";

import React from "react";
import ReactDOM from "react-dom";
import ConfirmationButton from "../app/components/ConfirmationButton";

document.querySelectorAll("[data-delete-button]").forEach(deleteEl => {
  const deleteData = deleteEl.dataset;
  ReactDOM.render(
    <ConfirmationButton
      extraClass={deleteData.extraClass}
      name={deleteData.name}
    />,
    deleteEl
  );
});
