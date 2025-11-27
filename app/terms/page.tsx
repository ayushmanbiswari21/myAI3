import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { OWNER_NAME } from "@/config";

export default function Terms() {
  return (
    <div className="w-full flex justify-center p-10">
      <div className="w-full max-w-screen-md space-y-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-gray-500 hover:text-gray-700 underline"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Back to Chatbot
        </Link>

        <h1 className="text-3xl font-bold">Food Recipe ChatBot</h1>
        <h2 className="text-2xl font-semibold">Terms of Use / Disclaimer</h2>

        <p className="text-gray-700">
          The following terms of use govern access to and use of the{" "}
          <strong>Food Recipe ChatBot</strong> (&quot;AI Chatbot&quot;), an
          artificial intelligence tool provided by {OWNER_NAME} (&quot;I&quot;,
          &quot;me&quot;, or &quot;myself&quot;). By engaging with the AI
          Chatbot, you agree to these terms. If you do not agree, you may not
          use the AI Chatbot.
        </p>

        {/* General Information */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">General Information</h3>
          <ol className="list-decimal list-inside space-y-3">
            <li className="text-gray-700">
              <span className="font-semibold">Provider and Purpose:</span> The
              AI Chatbot is a tool developed and maintained by {OWNER_NAME}. It
              is intended solely to assist users with{" "}
              <strong>
                recipe ideas, meal suggestions, cooking instructions, ingredient
                substitutions, and general food-related guidance
              </strong>
              . It is not a substitute for professional medical advice,
              nutritional counselling, or food-safety guidance, and it is not
              affiliated with or endorsed by any restaurant, brand, or
              institution.
            </li>

            <li className="text-gray-700">
              <span className="font-semibold">Third-Party Involvement:</span>{" "}
              The AI Chatbot utilizes multiple third-party platforms and
              vendors, some of which may operate outside your country of
              residence. Your inputs may be transmitted, processed, and stored
              by these third-party systems. As such, confidentiality, security,
              and privacy cannot be guaranteed, and data transmission may be
              inherently insecure and subject to interception.
            </li>

            <li className="text-gray-700">
              <span className="font-semibold">No Guarantee of Accuracy:</span>{" "}
              The AI Chatbot is designed to provide helpful and relevant
              responses but may deliver <strong>inaccurate, incomplete</strong>,
              or <strong>outdated</strong> information. This includes, but is
              not limited to, ingredient quantities, cooking times,
              temperatures, allergen information, and nutritional values. Users
              are strongly encouraged to independently verify any information
              before relying on it for cooking, dietary choices, or health-
              related decisions.
            </li>
          </ol>
        </div>

        {/* Liability */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Liability</h3>
          <ol className="list-decimal list-inside space-y-3">
            <li className="text-gray-700">
              <span className="font-semibold">Use at Your Own Risk:</span> The
              AI Chatbot is provided on an &quot;as-is&quot; and
              &quot;as-available&quot; basis. To the fullest extent permitted by
              law:
              <ul className="list-disc list-inside ml-6 mt-2 space-y-2">
                <li>
                  {OWNER_NAME} disclaims all warranties, express or implied,
                  including but not limited to warranties of merchantability,
                  fitness for a particular purpose, and non-infringement.
                </li>
                <li>
                  {OWNER_NAME} is not liable for any errors, inaccuracies, or
                  omissions in the information provided by the AI Chatbot,
                  including cooking instructions, suggested temperatures,
                  ingredient combinations, or allergen information.
                </li>
              </ul>
            </li>

            <li className="text-gray-700">
              <span className="font-semibold">
                No Responsibility for Damages:
              </span>{" "}
              Under no circumstances shall {OWNER_NAME}, collaborators,
              partners, affiliated entities, or representatives be liable for
              any direct, indirect, incidental, consequential, special, or
              punitive damages arising out of or in connection with the use of
              the AI Chatbot. This includes, without limitation, any damages
              related to food spoilage, allergic reactions, health issues,
              kitchen accidents, or property damage.
            </li>

            <li className="text-gray-700">
              <span className="font-semibold">
                Modification or Discontinuation:
              </span>{" "}
              I reserve the right to modify, suspend, or discontinue the AI
              Chatbot&apos;s functionalities at any time without notice.
            </li>

            <li className="text-gray-700">
              <span className="font-semibold">Future Fees:</span> While the AI
              Chatbot is currently provided free of charge, I reserve the right
              to implement a fee for its use at any time.
            </li>
          </ol>
        </div>

        {/* User Responsibilities */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">User Responsibilities</h3>
          <ol className="list-decimal list-inside space-y-3">
            <li className="text-gray-700">
              <span className="font-semibold">Eligibility:</span> Use of the AI
              Chatbot is restricted to individuals aged 18 or older, or to
              minors using it under the supervision of a parent or legal
              guardian.
            </li>

            <li className="text-gray-700">
              <span className="font-semibold">Food Safety & Health:</span> You
              are solely responsible for:
              <ul className="list-disc list-inside ml-6 mt-2 space-y-2">
                <li>
                  Checking ingredient labels for allergens and intolerances.
                </li>
                <li>
                  Ensuring food is stored, handled, and cooked according to safe
                  food-handling practices and local health guidelines.
                </li>
                <li>
                  Consulting a qualified professional (doctor, dietitian, or
                  nutritionist) for medical, dietary, or health-related advice.
                </li>
                <li>
                  Not using the AI Chatbot for emergency situations or critical
                  health decisions.
                </li>
              </ul>
            </li>

            <li className="text-gray-700">
              <span className="font-semibold">Prohibited Conduct:</span> By
              using the AI Chatbot, you agree not to:
              <ul className="list-disc list-inside ml-6 mt-2 space-y-2">
                <li>
                  Post or transmit content that is defamatory, offensive,
                  intimidating, illegal, racist, discriminatory, obscene, or
                  otherwise inappropriate.
                </li>
                <li>
                  Use the AI Chatbot to engage in unlawful or unethical
                  activities.
                </li>
                <li>
                  Attempt to compromise the security or functionality of the AI
                  Chatbot.
                </li>
                <li>
                  Copy, distribute, modify, reverse engineer, decompile, or
                  extract the source code of the AI Chatbot without explicit
                  written consent.
                </li>
              </ul>
            </li>
          </ol>
        </div>

        {/* Data Privacy and Security */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Data Privacy and Security</h3>
          <ol className="list-decimal list-inside space-y-3">
            <li className="text-gray-700">
              <span className="font-semibold">No Privacy Guarantee:</span> The
              AI Chatbot does not guarantee privacy, confidentiality, or
              security of the information you provide. Conversations may be
              reviewed by {OWNER_NAME}, collaborators, partners, or affiliated
              entities for purposes such as improving the AI Chatbot, analysing
              usage patterns, and developing new features or content.
            </li>

            <li className="text-gray-700">
              <span className="font-semibold">Public Information:</span> Any
              information you provide through the AI Chatbot may be treated as
              public and non-confidential. You should avoid sharing sensitive
              personal data, including but not limited to financial information,
              health records, or precise location data.
            </li>

            <li className="text-gray-700">
              <span className="font-semibold">Data Transmission:</span> Inputs
              may be transmitted to and processed by third-party services. By
              using the AI Chatbot, you consent to such transmission and
              processing.
            </li>
          </ol>
        </div>

        {/* Ownership & Commercial Use */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">
            Ownership of Content and Commercial Use
          </h3>
          <ol className="list-decimal list-inside space-y-3">
            <li className="text-gray-700">
              <span className="font-semibold">Surrender of Rights:</span> By
              using the AI Chatbot, you irrevocably assign and surrender all
              rights, title, interest, and intellectual property rights in any
              content, inputs you provide, and outputs generated by the AI
              Chatbot to {OWNER_NAME}. This includes, but is not limited to,
              text, questions, feedback, and conversations.
            </li>

            <li className="text-gray-700">
              <span className="font-semibold">
                Commercial and Research Use:
              </span>{" "}
              {OWNER_NAME} reserves the right to use any input provided by users
              and any output generated by the AI Chatbot for commercial
              purposes, analysis, or research, without compensation or
              notification to users.
            </li>

            <li className="text-gray-700">
              <span className="font-semibold">
                No Claim to Gains or Profits:
              </span>{" "}
              Users agree that they have no rights, claims, or entitlement to
              any gains, profits, or benefits derived from the use or
              exploitation of the content provided to the AI Chatbot.
            </li>
          </ol>
        </div>

        {/* Indemnification */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Indemnification</h3>
          <p className="text-gray-700">
            By using the AI Chatbot, you agree to indemnify and hold harmless{" "}
            {OWNER_NAME}, collaborators, partners, affiliated entities, and
            representatives from any claims, damages, losses, or liabilities
            arising out of your use of the AI Chatbot or violation of these
            terms.
          </p>
        </div>

        {/* Governing Law */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">
            Governing Law and Jurisdiction
          </h3>
          <p className="text-gray-700">
            These terms are governed by the laws of India. Additional
            jurisdictions may apply for users outside India, subject to
            applicable local laws. In case of conflicts, the laws of India shall
            prevail to the extent permissible. Any disputes arising under or in
            connection with these terms shall be subject to the exclusive
            jurisdiction of the courts located in India.
          </p>
        </div>

        {/* Acceptance */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Acceptance of Terms</h3>
          <p className="text-gray-700">
            By using the AI Chatbot, you confirm that you have read, understood,
            and agreed to these Terms of Use and Disclaimer. If you do not agree
            with any part of these terms, you may not use the AI Chatbot.
          </p>
        </div>

        <div className="mt-8 text-sm text-gray-600">
          <p>Last Updated: November 27, 2025</p>
        </div>
      </div>
    </div>
  );
}
