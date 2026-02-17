import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_KEY!
    );

    const { data: latestTimeData, error: timeError } = await supabase
      .from('cro_lang_data')
      .select('snapshot_time')
      .order('snapshot_time', { ascending: false })
      .limit(1);

    if (timeError || !latestTimeData?.[0]?.snapshot_time) {
      return res.status(500).json({ error: 'Failed to fetch snapshot time' });
    }

    const latestSnapshotTime = latestTimeData[0].snapshot_time;

    const { data, error } = await supabase
      .from('cro_lang_data')
      .select('code, lang, residents, api_reach_min, api_reach_max, api_reach_avg, country, snapshot_time')
      .eq('snapshot_time', latestSnapshotTime);

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch data' });
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
}
