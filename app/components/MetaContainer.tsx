//app/components/MetaContainer.tsx

import { createClient } from '@supabase/supabase-js';
import MetaPlot from './MetaPlot';

interface LangData {
  lang: string;
  code: string;
  residents: number;
  api_reach_min: number;
  api_reach_max: number;
  api_reach_avg: number;
  country: 'N/A';
}


export default async function MetaPlotContainer() {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  );

  const { data, error } = await supabase
    .from<'cro_lang_data', LangData>('cro_lang_data')
    .select('*')
    .order('snapshot_time', { ascending: false });

  if (error) {
    console.error('Supabase fetch error:', error);
    return <div>Error fetching data</div>;
  }

  if (!data || data.length === 0) {
    return <div>No data available</div>;
  }

  return <MetaPlot data={data} />;
}