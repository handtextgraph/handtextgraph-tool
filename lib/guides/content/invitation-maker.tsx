import Link from "next/link";

/**
 * Guide #4 — "How to Make an Invitation with an Invitation Maker".
 *
 * Every capability claim here was checked against the real tool before
 * writing (components/tools/GeneratorTools.tsx, InvitationTool, plus
 * inviteThemes and lib/stage5-content.ts):
 * seven templates — birthday, wedding, party, graduation, baby shower,
 * anniversary, custom — each with its own background colour, accent
 * colour, and heading label (custom prints "You are invited"); seven
 * editable text fields — event, host, date, time, venue, rsvp, message
 * (message is a textarea, the rest are plain text inputs, so the date
 * and time are typed, not picked from a calendar); three fonts —
 * Georgia, Kalam handwriting, Arial — defaulting to Georgia; free
 * text-colour and background-colour pickers (changing the template
 * resets the background to that theme's default); a live preview on a
 * square 1000 by 1000 px canvas with a double border in the theme
 * accent, laid out as label, event title, "Hosted by …", date, time,
 * venue, message, and the RSVP line at the bottom; downloads are PNG,
 * JPG, and PDF, plus a Print button that prints the preview. There is
 * NO photo or illustration upload, NO guest list, NO RSVP tracking,
 * NO sending, NO shareable link, and NO save/load — and only ONE
 * fixed layout, so the registry description's "pick a layout" was
 * corrected to "pick a theme".
 */

export const invitationMakerFaqs: readonly {
  question: string;
  answer: string;
}[] = [
  {
    question: "Is the invitation maker free?",
    answer:
      "Yes. You can design an invitation, download it, and print it without creating an account and without paying. The tool runs in your browser and nothing you type is saved on the site.",
  },
  {
    question: "What occasions can I make invitations for?",
    answer:
      "Seven templates: birthday, wedding, party, graduation, baby shower, anniversary, and a custom theme that prints “You are invited” as its heading. The custom theme suits anything that does not fit the other six, such as a housewarming, a farewell, or a community gathering.",
  },
  {
    question: "Can I print the invitation?",
    answer:
      "Yes. Download it as a PDF and print that, or use the Print button under the preview to print the card straight from your browser. The card is a square 1000 by 1000 px image, about 3.3 inches across at 300 DPI, so print it at its native square size on photo paper, or ask a print shop to enlarge it — enlarging it much beyond 5 inches across will soften the edges.",
  },
  {
    question: "Can I add a photo to the invitation?",
    answer:
      "No. The maker uses a flat background colour with a double border and your own wording only — there is no photo upload, no illustration, and no decorative image. If you want a photo on the card, download the invitation and add the photo in an image editor, or use a photo-based invitation service instead.",
  },
  {
    question: "Can I change the colours and the font?",
    answer:
      "Yes. There are three fonts — Georgia, Kalam handwriting, and Arial — plus a text-colour picker and a background-colour picker, so you can match the card to your party colours. One thing to know: picking a different template resets the background colour to that theme's default, so choose the template first and set your own colours after.",
  },
  {
    question: "Does it send the invitation or track RSVPs?",
    answer:
      "No. This maker designs one printable card — it does not send invitations, keep a guest list, or track replies. Put a phone number or an email address in the RSVP line and collect the replies yourself, then share the downloaded image by message or email, or print copies and hand them out.",
  },
];

export function InvitationMakerGuideBody() {
  return (
    <>
      <p>
        An invitation maker turns the details of your event into a
        finished card — the occasion, the host, the date and time, the
        venue, and a short message, laid out and ready to print or
        share. It is the quick way to make a birthday, wedding, or
        party invitation without opening a design app or starting from
        a blank page. This guide walks through the{" "}
        <Link
          href="/invitation-maker"
          className="font-bold text-brand-teal hover:underline"
        >
          invitation maker
        </Link>{" "}
        on this site, which is free, needs no account, and shows a live
        preview of the card as you type.
      </p>
      <p>
        The whole job takes a few minutes: pick a template for the
        occasion, write the wording, choose a font and colours, check
        the preview, then download it or print it. The tool keeps the
        layout fixed, so you only make the decisions that matter — what
        the card says and how it looks — and the card is always tidy.
      </p>

      <h2>How to make an invitation in six steps</h2>

      <h3>Step 1 — Pick a template for the occasion</h3>
      <p>
        Start with the Template dropdown at the top of the controls.
        There are seven to choose from: birthday, wedding, party,
        graduation, baby shower, anniversary, and custom. Each one sets
        a background colour, an accent colour for the border and
        heading, and a heading label — the wedding theme prints
        “WEDDING” at the top, the birthday theme prints “BIRTHDAY”,
        and the custom theme prints “YOU ARE INVITED”, which makes it
        the right choice for anything that does not fit the other six,
        such as a housewarming or a farewell. Pick the template before
        you touch the colours: changing the template resets the
        background colour to that theme’s default, so any background
        colour you picked first will be lost.
      </p>

      <h3>Step 2 — Write the wording</h3>
      <p>
        Fill in the seven fields underneath, from the top down: Event,
        Host, Date, Time, Venue, Rsvp, and Message. The event line is
        the biggest text on the card, so put the person’s name and the
        occasion first — “Maya’s 30th Birthday”, “The Wedding of Ana
        and Ben”, “Rahim’s Graduation”. The host field prints as
        “Hosted by …”, so write a name or a family there. The date and
        time are plain text fields, not a calendar picker, so write
        them out in full — “Saturday, June 12” and “4:00 PM” — exactly
        as you want guests to read them. The message field is the place
        for one or two warm sentences, such as “Join us for an
        afternoon of food, games, and wonderful company.” Keep it
        short: the card is square and the message wraps onto two lines
        at most before it starts to crowd the design. Finally, put a
        phone number or an email address in the RSVP line — “RSVP:
        Maya, 555-0123” — because the tool does not collect replies
        for you.
      </p>

      <h3>Step 3 — Choose a font</h3>
      <p>
        Pick one of the three fonts to match the tone of the event.
        Georgia is a classic serif and reads formal, which suits
        weddings and anniversaries. Kalam is a handwriting font, which
        feels warm and personal for birthdays and baby showers. Arial
        is clean and neutral, and works for anything else. The font
        applies to the whole card, so there is no mixing — one font for
        the event title, the details, and the message. If you are not
        sure, leave Georgia on: it is the default for a reason, and it
        looks right on almost any occasion.
      </p>

      <h3>Step 4 — Set the colours</h3>
      <p>
        Use the text-colour and background-colour pickers to match the
        card to your party colours — a deep navy on cream for a formal
        wedding, a bright pink on pale rose for a child’s birthday. The
        theme already gives you a background and an accent colour, so
        you only need to change these if you want something different.
        Remember the rule from step one: pick the template first, then
        set your colours, or the template change will wipe your
        background choice. Check the contrast as you go — dark text on
        a pale background is the easiest to read, and the accent colour
        of the double border comes from the theme, not from your
        pickers, so the border always matches the theme you chose.
      </p>

      <h3>Step 5 — Check the live preview</h3>
      <p>
        The preview on the right updates as you type, so read the card
        the way a guest would. The layout is fixed: the theme label at
        the top, then the event title in large type, “Hosted by …”,
        the date, the time, the venue, the message, and the RSVP line
        at the bottom, all centred inside a double border. Look for the
        small mistakes that are easy to miss — a wrong date, a venue
        with no town, a message that ran too long and crowded the
        bottom of the card. Long event titles wrap onto a second line,
        which is fine, but a message longer than two or three sentences
        will squeeze everything below it. Move extra details such as
        parking, dress code, or gift notes out of the message and into
        the note you send with the invitation instead.
      </p>

      <h3>Step 6 — Download it or print it</h3>
      <p>
        When the card looks right, download it with one of the three
        buttons under the preview: PNG for sharing in messages and on
        social media, JPG for the same, or PDF for printing. There is
        also a Print button that prints the preview directly from your
        browser. Download or print before you close the page: nothing
        is saved, and each visit starts fresh with the sample birthday
        invitation. For a printed card, download the PDF and print it
        at its native square size on photo paper, and print one test
        copy first — flat background colours can look darker on paper
        than on screen.
      </p>

      <h2>Wording for each occasion</h2>
      <p>
        Every template uses the same seven fields, so the wording, not
        the layout, is what makes each occasion feel right. Birthday
        invitations work best with a warm, short message and the
        practical details up front: what is happening, when, and
        where. For a child’s birthday, add the age in the event line
        and the name of the host parent in the host field. Wedding
        invitations should name both people and keep the tone formal —
        “The Wedding of Ana and Ben” as the event, the couple’s
        families or the couple themselves as host, and the ceremony
        time and venue spelled out in full. Anniversary invitations
        follow the same shape, with the number of years in the event
        line, such as “25th Wedding Anniversary”. Graduation
        invitations name the graduate and the school, and usually add
        the ceremony time followed by a reception note in the message
        field. Baby shower invitations name the parent-to-be and the
        host, and the message field is the place for a gift note if
        there is one. Party invitations can be casual — the theme
        colour and a one-line message carry the tone — but still give
        the date, time, and venue in full. Whatever the occasion, read
        the finished card once as a guest would: if any of who, what,
        when, or where is missing, add it before downloading.
      </p>

      <h2>More for the party</h2>
      <p>
        An invitation is usually the first thing guests see, not the
        only thing you make. The{" "}
        <Link
          href="/guides/word-search-maker"
          className="font-bold text-brand-teal hover:underline"
        >
          word search maker guide
        </Link>{" "}
        shows how to turn the guest of honour’s name and favourite
        words into a puzzle to hand out at the party, and the{" "}
        <Link
          href="/guides/text-to-handwriting"
          className="font-bold text-brand-teal hover:underline"
        >
          text to handwriting guide
        </Link>{" "}
        shows how to turn the same wording into handwritten-style
        place cards or thank-you notes to match the invitation — the
        Kalam handwriting font on the card and the handwriting
        converter share the same handwritten look. For a handwritten
        sign-off on the thank-you notes, the{" "}
        <Link
          href="/guides/signature-generator"
          className="font-bold text-brand-teal hover:underline"
        >
          signature generator guide
        </Link>{" "}
        walks through making a signature to print alongside your name.
        And if you are printing a whole set of party pieces, the{" "}
        <Link
          href="/printable-worksheets"
          className="font-bold text-brand-teal hover:underline"
        >
          printable worksheets
        </Link>{" "}
        page gathers the puzzle and paper tools in one place.
      </p>

      <h2>What the invitation maker does not do</h2>
      <p>
        An honest note, because it shapes what you should expect. This
        maker designs a single printable card with one fixed layout:
        you cannot add a photo or an illustration, change where the
        lines sit, or pick a different card size — every invitation is
        the same square card with a double border, and only the theme,
        the wording, the font, and the colours change. There is no
        guest list, no RSVP tracking, and no sending: you download the
        finished image and share it yourself, by message, email, or
        print, and you collect the replies on the phone number or
        email address you put in the RSVP line. Nothing is saved, so
        closing the page loses the card. Within those limits, the
        process is short: pick a template, write the wording, choose
        a font and colours, check the preview, and download it.
      </p>
    </>
  );
}
