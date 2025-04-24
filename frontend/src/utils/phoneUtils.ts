import { parsePhoneNumber, isValidPhoneNumber, CountryCode } from 'libphonenumber-js';
import { Country } from '../data/countries';

export interface PhoneValidationResult {
  isValid: boolean;
  formattedNumber: string;
  error?: string;
}

export const formatPhoneNumber = (value: string, countryCode: CountryCode): string => {
  try {
    const phoneNumber = parsePhoneNumber(value, countryCode);
    if (phoneNumber) {
      return phoneNumber.formatInternational();
    }
    return value;
  } catch (error) {
    return value;
  }
};

export const validatePhoneNumber = (value: string, countryCode: CountryCode): PhoneValidationResult => {
  try {
    const phoneNumber = parsePhoneNumber(value, countryCode);
    
    if (!phoneNumber) {
      return {
        isValid: false,
        formattedNumber: value,
        error: 'Please enter a valid phone number',
      };
    }

    if (!isValidPhoneNumber(phoneNumber.number, countryCode)) {
      return {
        isValid: false,
        formattedNumber: phoneNumber.formatInternational(),
        error: 'Please enter a valid phone number for the selected country',
      };
    }

    return {
      isValid: true,
      formattedNumber: phoneNumber.formatInternational(),
    };
  } catch (error) {
    return {
      isValid: false,
      formattedNumber: value,
      error: 'Please enter a valid phone number',
    };
  }
};

export const getCountryFromPhoneNumber = (phoneNumber: string): Country | null => {
  try {
    const parsedNumber = parsePhoneNumber(phoneNumber);
    if (parsedNumber && parsedNumber.country) {
      return {
        code: parsedNumber.country as CountryCode,
        name: parsedNumber.country,
        flag: getCountryFlag(parsedNumber.country as CountryCode),
      };
    }
    return null;
  } catch (error) {
    return null;
  }
};

type SupportedCountryCode = 'US' | 'GB' | 'CA' | 'AU' | 'DE' | 'FR' | 'IN' | 'JP' | 'BR' | 'CN' | 'MX' | 'AR' | 'CO' | 'CL' | 'PE' | 'VE' | 'ZA' | 'SA' | 'AE';

export const getCountryFlag = (countryCode: CountryCode): string => {
  // Map of country codes to flag emojis
  const flagMap: { [key in SupportedCountryCode]: string } = {
    US: '🇺🇸',
    GB: '🇬🇧',
    CA: '🇨🇦',
    AU: '🇦🇺',
    DE: '🇩🇪',
    FR: '🇫🇷',
    IN: '🇮🇳',
    JP: '🇯🇵',
    BR: '🇧🇷',
    CN: '🇨🇳',
    MX: '🇲🇽',
    AR: '🇦🇷',
    CO: '🇨🇴',
    CL: '🇨🇱',
    PE: '🇵🇪',
    VE: '🇻🇪',
    ZA: '🇿🇦',
    SA: '🇸🇦',
    AE: '🇦🇪',
  };

  return flagMap[countryCode as SupportedCountryCode] || '🌐';
};

export const getPhoneNumberInfo = (phoneNumber: string, countryCode: CountryCode) => {
  try {
    const parsedNumber = parsePhoneNumber(phoneNumber, countryCode);
    if (!parsedNumber) return null;

    return {
      countryCode: parsedNumber.country,
      nationalNumber: parsedNumber.nationalNumber,
      internationalFormat: parsedNumber.formatInternational(),
      nationalFormat: parsedNumber.formatNational(),
      isValid: isValidPhoneNumber(parsedNumber.number, countryCode),
    };
  } catch (error) {
    return null;
  }
}; 