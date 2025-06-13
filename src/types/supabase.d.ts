// Custom Supabase type augmentations.
//
// We intentionally avoid re-declaring the entire module to prevent hiding
// existing exports (e.g. `createClient`).  Add specific augmentations inside
// the module block if/when they are actually needed.
//
// Example:
//
// declare module '@supabase/supabase-js' {
//   interface User {
//     first_name?: string;
//   }
// }
//
// Until then, this file just needs to exist so that future augmentations can
// be placed here.

export {};
