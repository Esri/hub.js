export interface IHubSiteTheme {
  header: {
    background: string;
    text: string;
  };
  body: {
    background: string;
    text: string;
    link: string;
  };
  button: {
    background: string;
    text: string;
  };
  logo: {
    small: string;
  };
  fonts: {
    base: {
      url: string;
      family: string;
    };
    heading: {
      url: string;
      family: string;
    };
  };
}
