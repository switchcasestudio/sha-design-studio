// The two editions are page lists over the same content and the same parts.
import * as A from './pages-a.js';
import * as B from './pages-b.js';
import * as D from './pages-c.js';
import * as E from './essentials.js';

const fullPages = () => {
  const rest = [
    A.hello(), A.who(), A.idea(), A.personality(), A.voice(), A.voiceExamples(),
    A.theMark(), A.lockups(), A.variants(), A.clearSpace(), A.misuse(),
    B.palette(), B.pairing(), B.access(), B.typeface(), B.scale(), B.setting(),
    B.family(), B.compose(), B.motifDonts(), B.icons(), B.photo(), B.process(), B.people(),
    D.layout(), D.components(), D.motion(), D.web(), D.social(), D.print(), D.clients(), D.assetIndex(), D.backCover(),
  ];
  const cover = A.fullCover();
  // Contents needs the final page list to print page numbers, so it is built last.
  const draft = [cover, { section: 'Welcome' }, ...rest];
  return [cover, A.contents(draft), ...rest];
};

export const editions = {
  full: {
    label: 'Full edition',
    title: 'Sha Design Studio: Brand book, Full edition',
    subject: 'Brand guidelines for Sha Design Studio (kit version 3): logo, color, type, motifs, photography, layout, motion and assets.',
    pages: fullPages,
  },
  essentials: {
    label: 'Essentials',
    title: 'Sha Design Studio: Brand book, Essentials',
    subject: 'The 12-page brand guidelines for Sha Design Studio (kit version 3), for printers, vendors and new collaborators.',
    pages: () => [
      E.cover(), E.whoIdea(), E.voice(), E.logoPage(), E.variants(), E.donts(),
      E.color(), E.type(), E.motifs(), E.photos(), E.inUse(), E.assets(),
    ],
  },
};
