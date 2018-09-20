import { Component, Prop, Event, EventEmitter } from '@stencil/core';

import { request } from "@esri/arcgis-rest-request";
import { UserSession, AuthenticationProvider } from "@esri/arcgis-rest-auth";

@Component({
  tag: 'arcgis-hub-login',
  styleUrl: 'arcgis-hub-login.css',
  shadow: true
})
export class ArcGISHubLoginComponent {

  @Prop() clientid: string;
  @Prop() communityorg: string;
  @Prop() enterpriseorg: string;
  @Prop({ mutable: true }) arcgisToken: string;

  // Component Events
  @Event() eventAddAnnotation: EventEmitter;

  render() {
    return (
      <div>
<h3>A Hub community account allows you to:</h3>
        <ul>
          <li>Follow Hub initiatives to stay up to date and informed</li>
          <li>Register for Hub events to engage with the Hub</li>
          <li>Create analyses and narratives to tell your own stories with Hub data</li>
        </ul>
        <hr />
        <h3>Sign In/Sign Up</h3>
        <div>
        <button onClick={() => this.launchAuth("facebook", this.communityorg)}>
            <img class="small-logo" src="//d1iq7pbacwn5rb.cloudfront.net/opendata-ui/assets/assets/images/facebook_btn-cece4e56a57496bc2da4c62d8fbd691d.png" alt="" /> Using Facebook
          </button>
          <button onClick={() => this.launchAuth("google", this.communityorg)}>
            <img class="small-logo" src="//d1iq7pbacwn5rb.cloudfront.net/opendata-ui/assets/assets/images/google_btn-8b7e21aaa900e1cb388760f964bb0b5b.png" alt="" /> Sign in with Google
          </button>
          <button onClick={() => this.launchAuth("arcgis", this.enterpriseorg)}>
            <img src="//d1iq7pbacwn5rb.cloudfront.net/opendata-ui/assets/assets/images/bank-34bcd4a0cb3cf2f66d6161f95a3be3d0.png" alt="" /> Sign in with Organization
          </button>
        </div>
          <hr />
          <h4><a role="button" data-toggle="collapse" aria-expanded="false" aria-controls="" class-name="signin-faq"><span class-name="glyphicon glyphicon-triangle-right"></span> FAQ</a></h4>
          <dl>
            <dt>"Why can't I login with my public account?"</dt>
            <dd>Your public account does not give you access to Hub features. You need a community account.</dd>
            <dt>"Why can't I sign up with an email other than Google or Facebook?"</dt>
            <dd>Email signups need manual admin approval and by using these alternatives, we can get you signed in immediately.</dd>
          </dl>
          {<button id="unique-arcgis-login-button" onClick={() => this.logToken()}>What is the token?</button>}
      </div>
    );
  }

  logToken() {
    alert("token: " + this.arcgisToken);
  }

  launchAuth(provider:AuthenticationProvider, organization: string) {
    const authComponent = this;
    return UserSession.beginOAuth2({
      clientId: this.clientid,
      redirectUri: window.location.origin + window.location.pathname + 'authenticate.html',
      portal: organization,
      provider
    })
      .then(function (authentication) {
        authComponent.arcgisToken = authentication.token;
        request("https://www.arcgis.com/sharing/rest/", { authentication })
          .then(response => console.log(response));
      });
  }

  // componentDidLoad() {
  // }
}
