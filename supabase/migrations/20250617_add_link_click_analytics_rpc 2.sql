-- Create an RPC function to group link clicks by date
CREATE OR REPLACE FUNCTION group_link_clicks_by_date(
  start_date TIMESTAMP WITH TIME ZONE,
  date_format TEXT
)
RETURNS TABLE (
  date_group TEXT,
  click_count BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    TO_CHAR(clicked_at, date_format) AS date_group,
    COUNT(*) AS click_count
  FROM
    link_clicks
  WHERE
    clicked_at >= start_date
  GROUP BY
    date_group
  ORDER BY
    date_group;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION group_link_clicks_by_date TO authenticated;

-- Create a view for link click analytics
CREATE OR REPLACE VIEW link_click_stats AS
SELECT
  COUNT(*) AS total_link_clicks,
  COUNT(DISTINCT url) AS unique_links_clicked,
  COUNT(DISTINCT user_id) AS unique_users,
  COUNT(DISTINCT ip_address) AS unique_ip_addresses
FROM
  link_clicks;

-- Grant select permission on the view to authenticated users
GRANT SELECT ON link_click_stats TO authenticated;
