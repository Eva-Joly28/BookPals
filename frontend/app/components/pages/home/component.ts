import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import type BookModel from "ember-boilerplate/models/book";

interface PagesHomeSignature {}


export default class PagesHomeComponent extends Component<PagesHomeSignature>{

    @tracked topBooks : BookModel[] = []
}