import { AgesexDto } from './agesex-dto';

describe('AgesexDto', () => {
  it('should have correct structure', () => {
    const dto: AgesexDto = { idAgeSex: 1, ageSexGroup: 'Teen' };
    expect(dto).toBeTruthy();
    expect(dto.idAgeSex).toBe(1);
  });
});
