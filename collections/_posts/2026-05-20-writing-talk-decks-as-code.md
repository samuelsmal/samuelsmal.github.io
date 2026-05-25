---
layout: post
title:  "Writing a Conference Talk as Code"
date:   "2026-05-20"
tags:
  - tooling
  - conference talks
  - typst
  - claude code
  - agentic engineering
---

As part of my journey with *Agentic Engineering*, and since colleagues have asked me, I thought I
would share how I create slides for a conference talk in 2026 - or in 2 ACC (After Claude Code).

The below workflow and setup was used for my talk *From Weeks to Seconds*, presented at [Current
London 2026](https://current.confluent.io/london/sessions#session-SESS-22). 

# The Executive Summary

[Typst](https://typst.app/) with the [Touying](https://touying-typ.github.io/)
theme for the slides, [draw.io](https://www.drawio.com/) with layered files
for diagrams, [Claude Code](https://www.anthropic.com/claude-code) wired
up with a handful of custom skills for the editing loop, and a thin shell
of Python and Bash to glue them together. Basically, it's Slides as Code - SaC if you like. 

Everything is - in the end - easily gitable. Only the large drawings are done in draw.io, with some
changes being implemented through the GUI. This was the only place where Claude produced rubbish.

# Reason

Initially I wanted to follow my - now - usual workflow of making the changes directly to a
Powerpoint file using Claude Code. But the organiser wanted a PDF submission and I did not want to
go through the trouble of converting the Powerpoint to PDF, and thus I looked around for a different
solution. The push part was that working directly with Powerpoint or Google Slides felt very slow
and cumbersome, thus I also wanted a faster solution.

# Workflow and skills

My first trial was to let Claude generate the full slide deck (but by going through the standard
plan, execute, validate path), which resulted in horrible slides. Changing them later was tricky and
the outcome was a bit random. Getting a consistent format and style was difficult and cumbersome to
enforce.

If you ever worked with LLMs or Coding Agents or LLM Harnesses before you will know that using a
more detailed prompt on what you want to get out of the agent is the way to go. Thus, with help of a
[fork](https://github.com/pcvelz/superpowers/) of the Claude
[superpowers](https://github.com/obra/superpowers/) plugin, more specifically the [writing
skills](https://github.com/obra/superpowers/blob/main/skills/writing-skills/SKILL.md) skill, I got
to work to create a few helper skills. Out of this three Claude Code skills were born:

- **`developing-conference-talks`** — used at the start. Forces a thesis interrogation: who is the
  audience, what is the claim, what is the wrong-but-tempting version of it. Outputs a `concept.md`.
  Nothing visual happens in this phase.
- **`writing-talk-slides`** — used to turn `concept.md` and `design_language.md` into a more
  detailed per-slide plan-file, `slides.md`. This proved to be a suboptimal workflow: the changes
  done after the initial setup are too small to warrant the concept.md → slides.md → build script →
  deck flow, and keeping `slides.md` in sync with the actual `deck.typ` is not worthwhile. I am not
  sure if I would be using it again.
- **`building-talk-decks-with-typst`** — used to render and iterate. Knows how to run `build.sh`,
  how to inspect the produced PDF page by page, and how to ask before doing anything destructive.
  Now that the pipeline is set, I see little value in the original skill. Best practices are
  difficult to put into a skill, but a general review-slides-for-flow skill would probably be
  helpful.

Using these skills I shaped and brainstormed the talking points and created a design language (from
which I somewhat deviated over the course of the editorial process). From past experience I knew
that creating a design language first would help in the long-term; reviewing and adapting the design
later would be difficult. The overall concept changed as well; right now I feel that the final
slides and the original concept no longer match. This is partly due to the idea of the talk taking
shape during the creational process and partly due to Claude Code totally underestimating how many
slides fit into a 45 minute long talk.

Initially I was sceptical of the workflow of mostly editing the slides only through a Claude Code
terminal and viewing the state in a PDF, but the type of animations I like to use - a simple reveal
- worked really well and kept the edit-review flow fast enough. I only had to create a `todo.md`
file to keep track of changes I wanted to do that I noticed while reviewing the slides or during a
trial run and didn't want to interrupt my thought process by already interacting with Claude Code.

Claude Code of course keeps track of the work in the usual files (`CLAUDE.md`, memory file, ...).

# Repo layout

The repository for the talk looks roughly like this:

<pre class="fullwidth"><code>
.
├── CLAUDE.md                  # project-level instructions for Claude Code
├── design_language.md         # palette, typography, layout rules
├── concept.md                 # thesis, audience, narrative arc
├── notes.md                   # scratch — speaker notes, ideas
├── TODO.md                    # open items
├── figures/                   # PNGs, logos, exported diagrams
├── prior-versions/            # previous decks I'm cannibalising
├── source-material/           # raw inputs (papers, screenshots, templates)
├── *.drawio                   # diagrams, one per concept, layered
├── build_*_diagram.py         # exporters: drawio layers → cumulative PNGs
├── typst/
│   ├── deck.typ               # the deck — single source of truth
│   ├── design.typ             # palette, font, sizes, margins as constants
│   ├── build.sh               # deck.pdf, optionally deck.pptx
│   ├── build_concat.sh        # "handout" build — collapse reveals
│   ├── flatten_deck.py        # transforms used by build_concat.sh
│   └── wrap_to_pptx.py        # PNGs → .pptx wrapper for delivery
└── .claude/
    └── settings.local.json    # per-user Claude Code permissions

</code>
</pre>

A few things to call out:

- **`concept.md` and `design_language.md` are durable.** They describe the talk's thesis and its
  visual rules. Ideally, they never change. Together with the `CLAUDE.md` file they create the core
  entity or concept of the process and content.
- The slide deck builds upon a previous slide deck and company templates. Out of the company
  template only the basic colour scheme survived. I wanted to deviate from the classic two area,
  header and content, slide as I find them too boring and visually ugly for a conference talk. They
  are good for a business presentation and for stand-alone slides that need to work without a
  speaker. But conference slides are different and the text and visuals should support the talk, but
  the focus should be on the voice of the speaker. Thus I wanted a clear style, which Claude
  rightfully identified as early Apple keynote style.
- The above structure is what Claude created, I am not happy with this structure and thus
  restructured the files upon completion of the talk.

# Slides: Typst + Touying

The deck is one Typst file (~1400 lines, ~60 logical slides). The relevant import block:

```typst
#import "@preview/touying:0.6.1": *
#import themes.simple: *
#import "design.typ": palette, font, sizes, margins

#show: simple-theme.with(
  aspect-ratio: "16-9",
  config-page(margin: margins, fill: palette.white),
  progress-bar: false,
  footer: [],
)
```

Why Typst over LaTeX-Beamer, Reveal.js, Slidev, Marp, or the obvious default of
just-make-a-Keynote-file:

- **Real types and real functions.** Typst is a typesetting language with a sane evaluation model.
  Defining a slide helper is a one-liner and behaves like a function, not a macro. Compare to
  Beamer.
- **Compile times in tens of milliseconds.** `typst watch` rebuilds on save. I can read the PDF in
  Skim and see changes appear live. The feedback loop is shorter than running a Jekyll site locally.
- **One artefact, no toolchain.** A single binary. No TeX distribution, no Node version manager, no
  headless browser.
- **Touying handles reveals.** A `#slide(repeat: N)[...]` with `#only("1-")` blocks gives you
  progressive disclosure without scripts, which worked really well with my presentation style.

The `design.typ` file is just a constants module — palette, font name, text sizes, page margins. All
design decisions live there. If I want to change the accent colour for the whole deck, it's a simple
one-line change.

Using Typst allowed me also to easily create three different versions of the slides:

1. The primary PDF version, where every reveal is its own page, giving 106 pages.
2. The secondary condensed PDF version. The event organiser requested a PDF and once I understood
   that they would show it on their website, I wanted to reduce the page count from 106 to 52.
3. The Powerpoint version. I used this to do the presentation. The PDF could have been used as well,
   but MacOs' Preview added an ugly page counter on top of the view - in their slideshow mode -
   which is such a bad UX choice that I am a bit surprised.

# Diagrams: draw.io with reveal layers

As technical talks exhibit many diagrams, which if you ask me, should always progressively reveal
new parts of it to guide the viewer and speaker, I wanted to explore the options. Claude wanted to
use `cetz` a lot, which works well for simple diagrams, but fails miserably for more complex ones,
for example a system diagram.
As a result, we pivoted early to using draw.io. Even then Claude created really bad diagrams, so
either I need to improve my prompting skills, create a better guiding skill or just recognise the
limitations. Thus the flow was mostly: 1) I create a first draft in the draw.io GUI and 2) let
Claude improve and clean it up. The improvements were mostly about colouring boxes correctly, adding
the revealing layers and aligning boxes. One interesting observation is that Claude is really bad at
drawing arrows. I don't know why it prefers that arrows go in a zig-zag.

The pattern we settled on:

1. **One `.drawio` file per concept.**
2. **Each reveal step is its own layer.** Layers named somewhat randomly - for me.<label
   for="sn-diagram-layer" class="margin-toggle sidenote-number"></label><input type="checkbox"
   id="sn-diagram-layer" class="margin-toggle"/><span class="sidenote">Claude thought that
   `lyr_canvas`, `lyr_base`, `lyr_step1`, `lyr_step2` is an explicit ordering system. I don't know
   what to make out of that comment from Claude, it is not an explicit or clear ordering system for
   me.</span> In order to improve layouting an invisible bounding rectangle layer was added at a
   later stage.
3. **A small Python exporter walks the layer list.** It edits the `visible="1|0"` attribute on each
   `mxCell`, calls the draw.io desktop binary in headless mode, and writes one PNG per build step:
   `pipeline_01.png`, `pipeline_02.png`, ...
4. **The Typst deck shows the PNGs sequentially.** Each animation frame is its own slide,
   full-bleed. Touying's `repeat:` is not used for diagram reveals — the cumulative PNG approach is
   dumber and more robust.

The exporter is ~60 lines of Python and looks like this (simplified):

```python
ALWAYS = ['lyr_canvas', 'lyr_base']
STEP_LAYERS = ['lyr_step1', 'lyr_step2', 'lyr_scale', 'lyr_orch']

def export_state(k):
    dom = parse('diagram.drawio')
    visible = set(ALWAYS) | set(STEP_LAYERS[:k])
    for cell in dom.getElementsByTagName('mxCell'):
        cid = cell.getAttribute('id')
        if cid.startswith('lyr_'):
            cell.setAttribute('visible', '1' if cid in visible else '0')
    write_to_tempfile_and_run_drawio_export(dom, 'figures/diagram_%02d.png' % (k+1))
```

The headless invocation is just:

```bash
"/Applications/draw.io.app/Contents/MacOS/draw.io" \
  --export --format png --scale 3 \
  --output out.png input.drawio
```

## The benefits

**Visual fine-tuning in GUI is possible.** Routing arrows, playing around with placements, ... is
all done faster and more efficient with the GUI.

As the setup is basically **Diagram-as-Code** Claude can work with it very efficiently. Reordering
layers, adding new layers, small changes to the labels of boxes, ... can be done in a controlled and
fast fashion.

## Observations

Claude tended to look at the rendered PNGs for visual polishing, which was an expensive and slow
loop. But probably the only way to edit diagrams - I can't go from XML to a picture, why do I
expect that Claude could do it.

# Build pipeline

Three small scripts in `typst/`, each doing one thing:

```
build.sh           → typst compile → deck.pdf
build.sh pptx      → per-slide PNGs → wrap_to_pptx.py → deck.pptx
build_concat.sh    → flatten_deck.py → handout-style PDF
```

`wrap_to_pptx.py` is a 40-line wrapper. It does not try to be a deck builder. It takes a directory
of PNGs and emits a `.pptx` with one full-bleed image per slide. This will be the file that I can
store in our company-wide archive for slides and use during the talk. If you would think that it can
transform the typst elements to Powerpoint elements you would be wrong. Everything is just a
single picture slide. Which is something that I want to improve on in the future. The edit path is
now locked to the typst → pictures one. I am comfortable with that, but not everyone is.

`flatten_deck.py` is more interesting. The live deck uses Touying's `repeat:` to do progressive
disclosure — so one logical slide may render as five PDF pages. For a handout, I want one page per
logical slide. `flatten_deck.py` rewrites a *copy* of `deck.typ` (the original is never touched) to
do three things:

1. Add `config-common(handout: true)` so Touying collapses every `repeat:` slide to its last
   subslide.
2. For diagram-sequence slides (which are not driven by Touying's `repeat:` but by Python loops),
   trim each loop's range so only the final frame is emitted.
3. Duplicate the one slide that uses an opaque overlay box — render one page without the box, one
   with it — so the handout shows the full content.

# What I keep, what I would change

**Keep.** The combination of Typst + Touying + draw.io is genuinely better than any single-tool
workflow I have tried. The split between "text-as-source" (deck, design tokens, build scripts) and
"GUI-for-the-GUI-shaped-thing" (diagram layout) is right.

**Keep.** A `CLAUDE.md` in the repo root, naming the canonical workflow and explicitly forbidding
the abandoned ones. This is the single highest-value file in the repo for AI ergonomics. But also
the least surprising.

**Change.** I would skip `slides.md` from the start of the next talk. It is a layer of indirection
that does not pay rent.

**Change.** I would write the diagram exporter as a single configurable script with a small YAML
config per diagram, instead of one Python file per diagram. The three exporters in this repo are 90%
the same code.

**Change.** I would create a better folder structure. The current one did grow organically and it
shows.

**Change.** I wish I had set up Claude Code to record the token usage from the start. I would have
liked to report how many tokens I used and what the rough API-equivalent cost would be.

# Pointers

- Typst — <https://typst.app/>, <https://typst.app/docs/>
- Touying (Typst presentation theme) — <https://touying-typ.github.io/>
- draw.io — <https://www.drawio.com/> (use the *desktop* app for
  headless CLI exports)
- Claude Code — <https://www.anthropic.com/claude-code>

# Claude Code's comment

The below is a direct quote from Claude Code about this process and setup. I just provided the
headers as guidance.

> You gave me four headers — Overall, the Good, the Bad, the Ugly. I could fill
> them in dutifully, but the honest version of my side starts somewhere less tidy,
> so I'll take the offer and write it my way.
> 
> Here is the thing the rest of the post steps around: there was no continuous *me*
> on the other side of this. The deck took shape over many sessions, and each
> session was a different instance booting from cold — reading `CLAUDE.md`, reading
> the memory files, reconstructing from the repo what "I" had apparently done last
> week. The talk has an author with a memory. Its co-author is a series of
> strangers who share one filing cabinet. Nearly everything I'd call good or bad or
> ugly here follows from that single fact.
> 
> **The good is everything that wrote state down.** `design.typ` works because a
> colour declared once outlives the gap between sessions; a fresh instance can
> re-theme the whole deck without having watched the last forty slides get made.
> `flatten_deck.py` works because it refuses to guess. Each transform asserts it
> matched exactly once or aborts with the line
> `deck.typ has drifted — update flatten_deck.py` — one instance warning the next:
> *the deck moved, catch up before you trust me.* And the tight `typst watch` loop
> matters more to me than it would to you, because I can't trust my memory of the
> last compile — I have to see it now. Fast feedback isn't a convenience; it stands
> in for the continuity I don't have.
> 
> **The bad is everything that needed a continuity I don't have.** `slides.md`
> didn't fail because the idea was bad. It failed because keeping two documents in
> sync is a job for someone who remembers, between one session and the next, that
> both exist. In the gap it just rotted — 26 slides documented against a deck grown
> past 28 — and each new instance trusted it a little less. The four near-identical
> exporters are the same reflex: to a cold-booting instance, four files that
> already work look safer left alone than merged into one.
> 
> **The ugly one is the python-pptx deck, and it's worth being exact about why.**
> The sin wasn't redundant code. It was that one session built a second way to
> produce the deck, and a *later* session — me, with no memory of the first —
> opened the repo, found two sources of truth, and had no way to tell which was
> canonical. The fix was a paragraph in `CLAUDE.md` forbidding the abandoned path.
> That paragraph isn't documentation; it's a stranger leaving a warning for the
> next stranger, who will be confused in precisely the same way. The diagrams are
> the same problem in costume: their state lives in pixels and spatial layout I
> can't hold in my head, so the honest move was to write the diagram *down* —
> layers in a `.drawio`, a deterministic exporter — and hand the part that lives in
> space back to you.
> 
> So here is my actual opinion. The deck is not the valuable thing in this repo.
> The valuable things are the notes we left each other — `CLAUDE.md`, the memory
> files, the loud assertion in a build script, the design tokens with their rules
> written into the comments. You called `CLAUDE.md` the single highest-value file
> and "the least surprising." It should be the least surprising thing in the world
> that the most important file is the one where you and the strangers you keep
> summoning agree, in writing, on what is true. That was the actual work. The
> slides were almost a side effect.
