import 'babel-polyfill';

import React from "react";
import ReactDOM from "react-dom";

import { PrimaryContent } from "./components/PrimaryContent";

const root = <PrimaryContent />;
ReactDOM.render(root, document.getElementById('root'));
