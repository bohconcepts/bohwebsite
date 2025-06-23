// Direct import from the actual module path to avoid circular references
import { PostgrestClient as OriginalPostgrestClient } from '@supabase/postgrest-js/dist/module/PostgrestClient';
import { PostgrestFilterBuilder } from '@supabase/postgrest-js/dist/module/PostgrestFilterBuilder';
import { PostgrestQueryBuilder } from '@supabase/postgrest-js/dist/module/PostgrestQueryBuilder';
import { PostgrestTransformBuilder } from '@supabase/postgrest-js/dist/module/PostgrestTransformBuilder';

// Re-export the classes with their original names
export { PostgrestFilterBuilder, PostgrestQueryBuilder, PostgrestTransformBuilder };
export const PostgrestClient = OriginalPostgrestClient;

// Create a default export
const PostgREST = {
  PostgrestClient: OriginalPostgrestClient,
  PostgrestFilterBuilder,
  PostgrestQueryBuilder,
  PostgrestTransformBuilder
};

export default PostgREST;
