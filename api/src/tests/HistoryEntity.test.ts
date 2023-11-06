import { getRowKeyValue } from '../functions/utils/HistoryEntity';


// jest.mock('ts-jest/utils');

describe('getRowKeyValue', () => {
  it('should return a string', () => {
    const result = getRowKeyValue();
    expect(typeof result).toBe('string');
  });

  it('should return a string with 15 characters', () => {
    const result = getRowKeyValue();
    expect(result.length).toBe(15);
  });

  it('should return a string with only numbers', () => {
    const result = getRowKeyValue();
    expect(result).toMatch(/^[0-9]+$/);
  });

  it('should return a string with a number greater than 0', () => {
    const result = getRowKeyValue();
    expect(parseInt(result)).toBeGreaterThan(0);
  });

  // it should mock the current date and calculate the difference between maxDate and a hardcoded date
  it('should return a hardcoded value from mocked current Date', () => {
    const mockDate = new Date("2020-01-01");
    const spy = jest.spyOn(global, 'Date').mockImplementation(() => mockDate as Date);
    const result = getRowKeyValue();
    expect(result).toBe("251824377600000");
    spy.mockRestore();
  });

});