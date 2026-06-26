import { ApiResponse } from './api.response';

describe('ApiResponse', () => {
  it('creates success payload', () => {
    const result = ApiResponse.success({ value: 1 });

    expect(result).toEqual({
      success: true,
      data: { value: 1 },
    });
  });

  it('creates fail payload', () => {
    const result = ApiResponse.fail('error message');

    expect(result).toEqual({
      message: 'error message',
    });
  });
});
