import { Component } from "@angular/core";
import { faHome } from "@fortawesome/free-solid-svg-icons";

@Component({
    template: `
<div class="container">
    <div class="row">
        <div class="col-md-12">
            <div class="error-template">
                <h1>
                    Oops!</h1>
                <h2>
                    404 Not Found</h2>
                <div class="error-details">
                    Sorry, an error has occured, Requested page not found!
                </div>
                <div class="error-actions">
                    <a class="btn btn-primary btn-lg" href="/">
                        <fa-icon [icon]="faHome"></fa-icon>
                        Take Me Home 
                    </a>
                </div>
            </div>
        </div>
    </div>
</div>
`,
    styles:[ 
        ".error-template {padding: 40px 15px;text-align: center;}",
        ".error-actions {margin-top:15px;margin-bottom:15px;}",
        ".error-actions .btn { margin-right:10px; }"
    ]
})
export class PageNotFound {
    public faHome = faHome;

}