import { useState, useEffect } from 'react';
import { Routes, Route, Link, Navigate, useState as useHookState } from 'react-router-dom';
import Auth from './components/Auth';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/Protected