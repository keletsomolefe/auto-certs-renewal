import { Test, TestingModule } from '@nestjs/testing';
import { CertificateCheckService } from './certificate-check.service';

describe('CertificateCheckService', () => {
  let service: CertificateCheckService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CertificateCheckService],
    }).compile();

    service = module.get<CertificateCheckService>(CertificateCheckService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
