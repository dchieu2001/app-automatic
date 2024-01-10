import "react-native-url-polyfill/auto";
import { createClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import { AsyncStorage } from "react-native";
const supabaseUrl = "https://mkqehsltfwvdsyckxmhe.supabase.co";
const supabaseKey =
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1rcWVoc2x0Znd2ZHN5Y2t4bWhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDQxMjczMTgsImV4cCI6MjAxOTcwMzMxOH0.4k794N_QpLLNrRgUtrFJrMlBLOQGg3SD9iOFNiJ2Ta4";
export const supabase = createClient(supabaseUrl, supabaseKey, {
  localStorage: AsyncStorage,
  detectSessionInUrl: false,
});

