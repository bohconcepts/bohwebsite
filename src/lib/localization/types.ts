// Define Client type directly here
export type Client = {
  id: string;
  name: string;
  logo: string;
  website?: string;
};

// Define types for services, statistics, and testimonials
export type Service = {
  id: string;
  title: string;
  description: string;
  icon: string;
  href?: string;
  positions?: string[];
};

export type Statistic = {
  id: string;
  value: string;
  label: string;
  icon?: string;
  description?: string;
};

export type Testimonial = {
  id: string;
  content: string;
  author: string;
  position: string;
  location: string;
  image?: string; // Optional image path for the testimonial
};

export type TeamMember = {
  id: string;
  name: string;
  position: string;
  bio: string;
  image: string;
  social: {
    linkedin?: string;
    twitter?: string;
    instagram?: string;
  };
};

export type PricingPlan = {
  id: string;
  name: string;
  description: string;
  price: string;
  features: string[];
  isPopular: boolean;
};

// Define types for localized constants
export type LocalizedConstants = {
  COMPANY_NAME: string;
  COMPANY_TAGLINE: string;
  COMPANY_DESCRIPTION: string;
  COMPANY_ADDRESS: string;
  COMPANY_PHONE: string;
  
  // Hero section text
  "A TRUSTED PARTNER": string;
  "Professional Hospitality Services": string;
  "Exceptional Hospitality Service": string;
  "Professional staff delivering impeccable table service and guest attention": string;
  "Trusted by Industry Leaders": string;
  "Partnering with top hotels and resorts across the nation": string;
  "Streamlined Recruitment Process": string;
  "From selection to onboarding, we handle every step with care": string;
  "Elevating Guest Experiences": string;
  "Professional hospitality staff that exceed expectations": string;
  "Premium Hospitality Staffing": string;
  "Exceptional talent for luxury hotels and resorts": string;
  "Join Our Team": string;
  "Our Approach": string;
  
  // Services section text
  "Premium Staffing Solutions": string;
  "We provide tailored hospitality staffing services to meet your specific needs, whether you are seeking talent or opportunities.": string;
  
  // CTA section text
  "Ready to Elevate Your Hospitality Career or Team?": string;
  "Whether you are seeking exceptional hospitality opportunities or endeavoring to assemble your ideal team, BOH Concepts offers tailored solutions designed to meet your specific needs.": string;
  "Find Opportunities": string;

  // Service position descriptions
  long_term_talents_description: string;
  seasonal_talents_description: string;
  show_more: string;
  show_less: string;
  available_positions: string;

  // Long-term positions
  position_housekeeping_leadership_long: string;
  position_housekeeping_attendants: string;
  position_laundry: string;
  position_food_beverage_long: string;
  position_stewarding: string;
  position_convention_services: string;
  position_culinary: string;
  position_maintenance: string;

  // Why Choose Us section
  why_choose_us: string;
  our_services_card: string;
  our_services_description: string;
  our_clients_card: string;
  our_clients_card_description: string;
  pricing_module_card: string;
  pricing_module_description: string;
  our_process_card: string;
  our_process_card_description: string;
  our_process_detailed_description: string;

  // Our Clients Page
  our_clients: string;
  our_clients_page_description: string;
  trusted_by_industry_leaders: string;
  client_trust_description: string;
  what_our_clients_say: string;

  // About section pages
  about_meta_description: string;
  teams_meta_description: string;
  mission_meta_description: string;
  values_meta_description: string;
  
  // About page content
  about_section_heading: string;
  about_section_heading_color: string;
  about_page_title: string;
  about_page_tag: string;
  about_paragraph_1: string;
  about_paragraph_2: string;
  about_paragraph_3: string;
  
  // Mission & Vision
  mission_heading: string;
  mission_heading_color: string;
  mission_page_title: string;
  mission_page_tag: string;
  mission_title: string;
  mission_description: string;
  mission_overview_description: string;
  vision_title: string;
  vision_description: string;
  
  // Values
  values_heading: string;
  values_heading_color: string;
  values_page_title: string;
  values_page_tag: string;
  values_description: string;

  // Markets page properties
  markets_page_title: string;
  markets_meta_description: string;
  markets_hero_tag: string;
  markets_section_tag: string;
  markets_section_title: string;
  markets_section_description: string;
  markets_industries_tag: string;
  markets_industries_title: string;
  markets_industries_description: string;
  
  // Global Hospitality Market section
  markets_hero_title: string;
  markets_hero_subtitle: string;
  
  // Markets Locations Section
  markets_locations_tag: string;
  markets_locations_title: string;
  markets_locations_description: string;
  
  // Markets Why Choose Us Section
  markets_why_tag: string;
  markets_why_title: string;
  markets_why_1_title: string;
  markets_why_1_description: string;
  markets_why_2_title: string;
  markets_why_2_description: string;
  markets_why_3_title: string;
  markets_why_3_description: string;
  
  // Industry descriptions
  industry_hotels_resorts: string;
  industry_hotels_resorts_desc: string;
  industry_safari_lodges: string;
  industry_safari_lodges_desc: string;
  industry_restaurants: string;
  industry_restaurants_desc: string;
  industry_conference_centers: string;
  industry_conference_centers_desc: string;
  industry_cruise: string;
  industry_cruise_desc: string;
  industry_airlines: string;
  industry_airlines_desc: string;
  
  // Team
  team_heading: string;
  team_heading_color: string;
  team_page_title: string;
  team_page_tag: string;
  team_description: string;
  testimonial_description: string;
  become_our_client: string;
  client_partnership_description: string;
  contact_us_today: string;

  // Pricing Page
  pricing: string;
  pricing_description: string;
  flexible_pricing_options: string;
  pricing_plans_description: string;
  frequently_asked_questions: string;
  faq_description: string;
  ready_to_get_started: string;
  contact_for_quote: string;
  request_a_quote: string;
  get_a_quote: string;
  most_popular: string;
  faq_pricing_question: string;
  faq_pricing_answer: string;
  faq_contracts_question: string;
  faq_contracts_answer: string;
  faq_upgrade_question: string;
  faq_upgrade_answer: string;

  // Pricing plan names
  standard_plan: string;
  premium_plan: string;
  enterprise_plan: string;

  // Pricing plan descriptions
  perfect_for_small_properties: string;
  ideal_for_luxury_hotels: string;
  for_hotel_chains: string;
  custom_quote: string;

  // Pricing plan features
  vetted_hospitality_staff: string;
  background_checks_included: string;
  basic_training_provided: string;
  standard_response_time: string;
  support_8_5: string;
  all_standard_features: string;
  enhanced_vetting_process: string;
  advanced_training_included: string;
  priority_response_time: string;
  support_24_7: string;
  dedicated_account_manager: string;
  all_premium_features: string;
  custom_training_programs: string;
  performance_analytics: string;
  strategic_staffing_consultation: string;
  multi_location_support: string;
  executive_reporting: string;

  // Our Process Page
  our_process: string;
  how_we_work: string;
  our_process_subtitle: string;
  benefits_of_our_process: string;
  process_benefits_description: string;
  ready_to_start: string;
  ready_to_start_journey: string;
  process_cta_description: string;
  get_started_today: string;
  TAILORED_SOLUTIONS: string;

  // Process steps
  process_step1_title: string;
  process_step1_description: string;
  process_step2_title: string;
  process_step2_description: string;
  process_step3_title: string;
  process_step3_description: string;
  process_step4_title: string;
  process_step4_description: string;
  process_step5_title: string;
  process_step5_description: string;
  process_step6_title: string;
  process_step6_description: string;

  // Process benefits
  benefit_time_efficiency: string;
  benefit_time_efficiency_description: string;
  benefit_quality_assurance: string;
  benefit_quality_assurance_description: string;
  benefit_ongoing_support: string;
  benefit_ongoing_support_description: string;

  // Seasonal positions
  position_housekeeping_leadership_seasonal: string;
  position_food_beverage_seasonal: string;

  SERVICES: Service[];
  FRAMEWORK: Service[];
  STATISTICS: Statistic[];
  TESTIMONIALS: Testimonial[];
  CLIENTS: Client[];
  TEAM_MEMBERS: TeamMember[];
  PRICING_PLANS: PricingPlan[];
  SITE_NAVIGATION: {
    title: string;
    href: string;
    dropdown?: { title: string; href: string }[];
  }[];
  testimonials_title: string;
  testimonials_subtitle: string;
  clients_title: string;
  clients_subtitle: string;
  footer_company_description: string;
  footer_stay_updated: string;
  footer_subscribe_to_newsletter: string;
  footer_enter_your_email: string;
  footer_subscribe: string;
  footer_quick_links: string;
  footer_our_services: string;
  footer_contact_us: string;
  footer_permanent_placement: string;
  footer_temporary_staffing: string;
  footer_executive_search: string;
  footer_consulting_services: string;
  footer_rights_reserved: string;
  footer_privacy_policy: string;
  footer_terms_of_service: string;
  footer_sitemap: string;
  BENEFITS: {
    id: string;
    title: string;
    description: string;
    icon: string;
  }[];
  VALUE_PROPS: {
    id: string;
    title: string;
    description: string;
  }[];
  COMPANY_VALUES: {
    id: string;
    title: string;
    description: string;
  }[];
  // Team members are now defined with the TeamMember type above
  CONTACT_INFO: {
    phone: string;
    email: string;
    address: string;
  };
  // CSR content keys
  csr_breast_cancer_title: string;
  csr_breast_cancer_description: string;
  csr_black_history_title: string;
  csr_black_history_description: string;
  csr_global_impact_title: string;
  csr_global_impact_description: string;

  SOCIAL_LINKS: {
    facebook: string;
    linkedin: string;
    instagram: string;
    youtube: string;
  };

  // Global Workforce Map
  global_workforce_tag: string;
  global_workforce_title: string;
  global_workforce_description: string;
  workforce_distribution: string;
  africa_workforce_count: string;
  us_workforce_count: string;
  workforce_highlights: string;
  workforce_highlight_1: string;
  workforce_highlight_2: string;
  workforce_highlight_3: string;
  workforce_highlight_4: string;
  employees: string;
  street_view: string;
  satellite_view: string;
  map_data_note: string;

  // Foundation page
  foundation_meta_description: string;
  foundation_page_title: string;
  foundation_hero_tag: string;
  foundation_hero_title: string;
  foundation_hero_subtitle: string;
  
  // Foundation - Our Mission section
  foundation_mission_tag: string;
  foundation_mission_title: string;
  foundation_mission_paragraph_1: string;
  foundation_mission_paragraph_2: string;
  
  // Foundation - What We Do section
  foundation_what_we_do_tag: string;
  foundation_what_we_do_title: string;
  foundation_what_we_do_description: string;
  foundation_program_scholarship_title: string;
  foundation_program_scholarship_description: string;
  foundation_program_borehole_title: string;
  foundation_program_borehole_description: string;
  foundation_program_clothing_title: string;
  foundation_program_clothing_description: string;
  foundation_program_financial_title: string;
  foundation_program_financial_description: string;
  
  // Foundation - How To Help section
  foundation_how_to_help_tag: string;
  foundation_how_to_help_title: string;
  foundation_how_to_help_description: string;
  foundation_help_donate_title: string;
  foundation_help_donate_description: string;
  foundation_help_donate_button: string;
  foundation_help_volunteer_title: string;
  foundation_help_volunteer_description: string;
  foundation_help_volunteer_button: string;
  foundation_help_partner_title: string;
  foundation_help_partner_description: string;
  foundation_help_partner_button: string;
};

// Constants that don't need translation
export const COMPANY_LOGO = "/images/logo/boh_logo.jpg";
