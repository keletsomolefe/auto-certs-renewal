import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  CertificateCheckService,
  CertificateDetails,
} from './certificate-check/certificate-check.service';
import * as fs from 'fs';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const certificateCheckService = app.get(CertificateCheckService);
  const exists = fs.existsSync('/certificates/prevCert');

  const certificateDetails =
    await certificateCheckService.getCertificateDetails('authentifi.nutun.com');

  if (!exists) {
    fs.writeFileSync(
      '/certificates/prevCert',
      JSON.stringify(certificateDetails),
    );
    return;
  }

  const prevCert = fs.readFileSync('/certificates/prevCert');
  const prevCertificateDetails = JSON.parse(
    prevCert.toString(),
  ) as CertificateDetails;

  if (prevCertificateDetails.fingerprint === certificateDetails.fingerprint) {
    Logger.log('Certificate has not changed');
    return;
  }

  Logger.log('Certificate has changed');
  // UPDATE THE CERTIFICATE HERE
  fs.writeFileSync(
    '/certificates/prevCert',
    JSON.stringify(certificateDetails),
  );

  await app.close();
}
bootstrap();
