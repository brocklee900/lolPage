import "./quiz.css";
import { testSupabase } from "./supabase";

const params = new URLSearchParams(window.location.search);

document.querySelector(".gif").src = await testSupabase(params.get("champion"), 1);

console.log(params.get("champion"));