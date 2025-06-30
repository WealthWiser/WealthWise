import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
const SUPABASE_URL = 'https://xlgyzgdvqbifgaspqlnl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhsZ3l6Z2R2cWJpZmdhc3BxbG5sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyNjc4NTEsImV4cCI6MjA2Njg0Mzg1MX0.n3yHws6Tg_VCxxu2V3s0pXj82tqc-cxFMk0g7DW3LlE';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
    persistSession: true,
    autoRefreshToken: true,
    storage: AsyncStorage,
    },
});
