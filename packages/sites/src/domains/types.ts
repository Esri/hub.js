export interface IDomainEntry {
  clientKey: string;
  createdAt?: string;
  domain: string;
  hostname: string;
  id: string;
  orgId: string;
  orgKey: string;
  orgTitle: string;
  permanentRedirect: boolean;
  siteId: string;
  siteTitle: string;
  sslOnly: boolean;
  updatedAt?: string;
}
