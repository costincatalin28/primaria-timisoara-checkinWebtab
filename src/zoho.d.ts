interface ZohoFunctionResponse {
  code: string;
  details: {
    output: string | any;
    output_type: string;
    id: string;
  };
  message: string;
}

interface ZohoFunctions {
  execute(functionName: string, params: { arguments?: string }): Promise<ZohoFunctionResponse>;
}

interface ZohoCRM {
  FUNCTIONS: ZohoFunctions;
}

interface ZohoEmbeddedApp {
  init(): void;
  on(event: string, callback: () => void): void;
}

interface Zoho {
  CRM: ZohoCRM;
  embeddedApp: ZohoEmbeddedApp;
}

interface Window {
  ZOHO?: Zoho;
}
