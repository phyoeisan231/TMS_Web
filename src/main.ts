import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { registerLicense } from '@syncfusion/ej2-base';

// Registering Syncfusion license key
registerLicense('MzU2NTk1NEAzMjM3MmUzMDJlMzBnNDNEZXBKbXd0QmlCREtOMVlGVDRadnNJTnl2enJvZTFxVWdSaHhOR3QwPQ==;MzU2NTk1NUAzMjM3MmUzMDJlMzBCM1NTZGtUMldJTU1oRThrTUlWZE1NQ0owZlkxZnZ4RlhyUjBpUmdPU1pjPQ==;Mgo+DSMBPh8sVXJzS0d+WFlPd11dXmJWd1p/THNYflR1fV9DaUwxOX1dQl9nSH9TcEdhWXdecXNQQWA=;ORg4AjUWIQA/Gnt2UlhhQlVMfV5AQmBIYVp/TGpJfl96cVxMZVVBJAtUQF1hTX9SdkNhW39WcHVSQ2dc;NRAiBiAaIQQuGjN/V0F+XU9AflRDX3xKf0x/TGpQb19xflBPallYVBYiSV9jS3pSd0VlW31eeHRUQWdfUw==;MzU2NTk1OUAzMjM3MmUzMDJlMzBMZkkrNTdOcDBIZUw0eHlrWklyRnRUbnZiRnhrZGhJTWNHTk9jdGdkRWxrPQ==;MzU2NTk2MEAzMjM3MmUzMDJlMzBoUkFYS0pFV1I2VGZYNkphVnpraW1DV2VzWUJ2S0Njdng5OTVhb203TzFjPQ==;Mgo+DSMBMAY9C3t2UlhhQlVMfV5AQmBIYVp/TGpJfl96cVxMZVVBJAtUQF1hTX9SdkNhW39WcHVdRWVa;MzU2NTk2MkAzMjM3MmUzMDJlMzBnaW1nUTE1NjBzSEZVbkZORVlaMWJKTm5tSFhHWTl0dHl0RGVvQUlDYTgwPQ==;MzU2NTk2M0AzMjM3MmUzMDJlMzBJbFNtWkpVTUpZQVQ4cE9lWUprSStwRDRJcHNhcWlraTBCRm1SMnEvV3ljPQ==;MzU2NTk2NEAzMjM3MmUzMDJlMzBMZkkrNTdOcDBIZUw0eHlrWklyRnRUbnZiRnhrZGhJTWNHTk9jdGdkRWxrPQ==');
if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
