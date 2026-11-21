/**
 * =====================================================================
 * MOCHI ENGLISH STUDIO - CONFIGURATION
 * =====================================================================
 */

// Cấu hình Tailwind pastel palette
if (typeof tailwind !== 'undefined') {
    tailwind.config = {
        theme: {
            extend: {
                fontFamily: {
                    sans: ['Nunito', 'sans-serif'],
                    display: ['Quicksand', 'sans-serif'],
                },
                colors: {
                    cream: '#FFFDF9',
                    blush: {
                        50: '#FFF5F7',
                        100: '#FFE4EC',
                        200: '#FFC6C7',
                        400: '#FF8BA7',
                        500: '#FA6E91',
                    },
                    mint: {
                        50: '#F2FCF5',
                        100: '#DCFCE7',
                        200: '#C3F0CA',
                        500: '#34D399',
                        600: '#10B981',
                    },
                    lavender: {
                        50: '#F8F5FF',
                        100: '#EFE7FE',
                        200: '#E2D1F9',
                        500: '#9F7AEA',
                        600: '#805AD5',
                    },
                    cocoa: {
                        700: '#594A4E',
                        800: '#33272A',
                    }
                },
                boxShadow: {
                    'pastel': '0 10px 25px -5px rgba(255, 139, 167, 0.14), 0 8px 10px -6px rgba(159, 122, 234, 0.08)',
                    'card': '0 4px 20px rgba(51, 39, 42, 0.05)',
                }
            }
        }
    };
}

const STORAGE_KEY = "mochi_english_studio_v3";
const API_KEY_STORAGE_KEY = "mochi_gemini_api_key";
const GEMINI_MODEL = "gemini-1.5-flash";
