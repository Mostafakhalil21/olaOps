import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import path from 'path';
import { OncallComponent } from './oncall/oncall.component';
import { AppComponent } from './app.component';
import { MainComponent } from './main/main.component';
import { JiraComponent } from './jira/jira.component';

export const routes: Routes = [
    {path: '' , component:MainComponent}
   
];
