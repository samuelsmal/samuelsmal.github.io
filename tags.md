---
layout: base
permalink: /tags/
title: Tags
---

## Tags

Every tag on the blog. Tags carrying more than one post are the threads worth
pulling; the rest are single labels, listed below them. Only posts appear
here — collections keep their own index.

{% assign sorted_tags = site.tags | sort %}

### Threads

{% for tag in sorted_tags %}
  {%- if tag[1].size > 1 -%}
  <div class="tag-section" id="{{ tag[0] | slugify }}">
    <h3 class="tag-heading sans">{{ tag[0] }}</h3>
    <ul class="tag-post-list">
      {%- for post in tag[1] -%}
      <li>
        <span class="tag-post-date sans">{{ post.date | date: "%Y-%m-%d" }}</span>
        <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
      </li>
      {%- endfor -%}
    </ul>
  </div>
  {%- endif -%}
{% endfor %}

### Single labels

<ul class="tag-index">
  {%- for tag in sorted_tags -%}
    {%- if tag[1].size == 1 -%}
      {%- assign post = tag[1] | first -%}
      <li id="{{ tag[0] | slugify }}">
        <span class="tag-index-name sans">{{ tag[0] }}</span>
        <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
      </li>
    {%- endif -%}
  {%- endfor -%}
</ul>
