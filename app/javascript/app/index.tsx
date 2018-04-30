import 'babel-polyfill';

import React from "react";
import {
  BrowserRouter as Router,
} from 'react-router-dom'
import ReactDOM from "react-dom";

import { PrimaryContent } from "./components/PrimaryContent";

const root = (
  <Router>
    <PrimaryContent />
  </Router>
  );

ReactDOM.render(root, document.getElementById('root'));
