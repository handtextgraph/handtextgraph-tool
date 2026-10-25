import { getLibraryTemplate, templateModel, templatePresets } from "@/lib/template-library";
import { createPaperGeneratorPdf } from "@/lib/paper-generator-pdf";
export const dynamicParams=false;
export function generateStaticParams(){return templatePresets.map(template=>({templateId:template.id}))}
export async function GET(_request:Request,{params}:{params:Promise<{templateId:string}>}){const template=getLibraryTemplate((await params).templateId);if(!template)return new Response("Template not found",{status:404});const pdf=createPaperGeneratorPdf(templateModel(template),template.orientation);const body=pdf.output("arraybuffer");return new Response(body,{headers:{"Content-Type":"application/pdf","Content-Disposition":`attachment; filename="${template.id}.pdf"`,"Cache-Control":"public, max-age=31536000, immutable","X-Content-Type-Options":"nosniff"}})}
