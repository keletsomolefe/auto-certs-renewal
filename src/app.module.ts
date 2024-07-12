import { Module } from '@nestjs/common';
import { CertificateCheckService } from './certificate-check/certificate-check.service';

@Module({
  providers: [CertificateCheckService],
})
export class AppModule {}
