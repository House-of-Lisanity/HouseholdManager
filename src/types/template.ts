export interface TemplateSheet {
  name: string;
  rows: string[][];
}

export interface WeeklyTemplate {
  file_name: string;
  sheets: TemplateSheet[];
}
