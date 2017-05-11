import React from "react";
import PropTypes from "prop-types";

import "bootstrap/dist/css/bootstrap-grid.min.css";
import "css/style.css";

export default function Layout({ children }) {
  return (
    <div className="container">
      {children}
    </div>
  );
}

Layout.propTypes = {
  children: PropTypes.element
};
