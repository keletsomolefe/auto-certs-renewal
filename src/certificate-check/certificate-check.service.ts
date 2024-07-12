import { Injectable, Logger } from '@nestjs/common';
import * as https from 'https';
import { TLSSocket } from 'tls';

export interface CertificateDetails {
  issuer: string;
  subject: string;
  serialNumber: string;
  publicKey: string;
  fingerprint: string;
}

@Injectable()
export class CertificateCheckService {
  private readonly logger = new Logger(CertificateCheckService.name);

  public async getCertificateDetails(
    hostname: string,
  ): Promise<CertificateDetails> {
    return new Promise((resolve, reject) => {
      const req = https.request(
        {
          host: hostname,
          port: 443,
          method: 'GET',
          rejectUnauthorized: false,
        },
        (res) => {
          const socket = res.socket as TLSSocket;
          const certificate = socket.getPeerCertificate();
          res.destroy();

          if (certificate) {
            const { issuer, subject, serialNumber, pubkey, fingerprint } =
              certificate;
            const publicKey = pubkey ? pubkey.toString() : '';

            return resolve({
              issuer: JSON.stringify(issuer),
              subject: JSON.stringify(subject),
              serialNumber,
              publicKey,
              fingerprint,
            });
          } else {
            return reject(new Error('Error fetching certificate'));
          }
        },
      );

      req.on('error', (err) => {
        const error = `Error fetching certificate for ${hostname}: ${err.message}`;
        this.logger.error(error);
        reject(error);
      });

      req.end();
    });
  }
}
