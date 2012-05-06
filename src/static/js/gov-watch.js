// Generated by IcedCoffeeScript 1.2.0i
(function() {
  var BOOK, SEARCHTERM, SLUG, all_books, all_subjects, all_tags, data_callback, do_search, generate_hash, generate_url, iced, initialized, load_data, loaded_data, onhashchange, process_data, run_templates, search_term, select_item, selected_book, selected_slug, set_fb_title, setup_searchbox, show_watermark, skip_overview, update_history, wm_shown, __iced_k,
    __slice = [].slice;

  iced = {
    Deferrals: (function() {

      function _Class(_arg) {
        this.continuation = _arg;
        this.count = 1;
        this.ret = null;
      }

      _Class.prototype._fulfill = function() {
        if (!--this.count) return this.continuation(this.ret);
      };

      _Class.prototype.defer = function(defer_params) {
        var _this = this;
        ++this.count;
        return function() {
          var inner_params, _ref;
          inner_params = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
          if (defer_params != null) {
            if ((_ref = defer_params.assign_fn) != null) {
              _ref.apply(null, inner_params);
            }
          }
          return _this._fulfill();
        };
      };

      return _Class;

    })(),
    findDeferral: function() {
      return null;
    }
  };
  __iced_k = function() {};

  loaded_data = null;

  all_books = [];

  all_tags = [];

  all_subjects = [];

  selected_book = "";

  search_term = "";

  selected_slug = "";

  skip_overview = false;

  BOOK = 'b';

  SLUG = 's';

  SEARCHTERM = 't';

  generate_hash = function(selected_book, search_term, slug) {
    if (slug) {
      return "!z=" + BOOK + ":" + selected_book + "|" + SEARCHTERM + ":" + search_term + "|" + SLUG + ":" + slug;
    } else {
      return "!z=" + BOOK + ":" + selected_book + "|" + SEARCHTERM + ":" + search_term;
    }
  };

  generate_url = function(slug) {
    return "http://" + window.location.host + "/#" + (generate_hash("", "", "", slug));
  };

  update_history = function(slug) {
    var ___iced_passed_deferral, __iced_deferrals,
      _this = this;
    ___iced_passed_deferral = iced.findDeferral(arguments);
    (function(__iced_k) {
      __iced_deferrals = new iced.Deferrals(__iced_k, {
        parent: ___iced_passed_deferral,
        filename: 'gov-watch.iced',
        funcname: 'update_history'
      });
      setTimeout((__iced_deferrals.defer({
        assign_fn: (function() {
          return function() {
            return __iced_deferrals.ret = arguments[0];
          };
        })(),
        lineno: 33
      })), 0);
      __iced_deferrals._fulfill();
    })(function() {
      return window.location.hash = generate_hash(selected_book, search_term, slug);
    });
  };

  set_fb_title = function(title) {
    $("title").html(title);
    return $("meta[property='og:title']").attr("content", title);
  };

  onhashchange = function() {
    var hash, key, part, slug, splits, value, _i, _len, _ref;
    hash = window.location.hash;
    hash = hash.slice(4, hash.length);
    splits = hash.split("|");
    slug = null;
    selected_book = null;
    search_term = "";
    for (_i = 0, _len = splits.length; _i < _len; _i++) {
      part = splits[_i];
      _ref = part.split(":"), key = _ref[0], value = _ref[1];
      if (key === BOOK) selected_book = value;
      if (key === SLUG) slug = value;
      if (key === SEARCHTERM) search_term = value;
    }
    if (!selected_book && !slug) {
      selected_book = all_books[0];
      update_history();
      return;
    }
    $("#books li.book").toggleClass('active', false);
    $("#books li.book[data-book='" + selected_book + "']").toggleClass('active', true);
    if (search_term !== "") {
      show_watermark(false);
      $("#searchbox").val(search_term);
    }
    $(".item").removeClass("bigger");
    if (slug) {
      selected_slug = slug;
      select_item(selected_slug);
      $(".item").removeClass("shown");
      return $("#items").isotope({
        filter: ".shown"
      });
    } else {
      set_fb_title('דו"ח טרכטנברג | המפקח: מעקב אחר ישום המלצות הועדה');
      selected_slug = null;
      select_item(null);
      return do_search();
    }
  };

  wm_shown = false;

  show_watermark = function(show) {
    if (show) {
      $("#searchbox").val("חיפוש חופשי בתוך ההמלצות");
    } else {
      if (wm_shown) $("#searchbox").val("");
    }
    wm_shown = show;
    return $("#searchbox").toggleClass('watermark', show);
  };

  data_callback = function(data) {
    var gov_updates, k, l, num_links, rec, tag, u, v, watch_updates, _i, _j, _k, _l, _len, _len2, _len3, _len4, _ref, _ref2, _ref3;
    loaded_data = data;
    all_books = {};
    all_tags = {};
    all_subjects = {};
    for (_i = 0, _len = data.length; _i < _len; _i++) {
      rec = data[_i];
      num_links = {};
      if (!all_books[rec.base.book]) all_books[rec.base.book] = {};
      all_books[rec.base.book][rec.base.chapter] = true;
      _ref = rec.base.tags;
      for (_j = 0, _len2 = _ref.length; _j < _len2; _j++) {
        tag = _ref[_j];
        all_tags[tag] = 1;
      }
      all_subjects[rec.base.subject] = 1;
      gov_updates = [];
      watch_updates = [];
      _ref2 = rec.updates;
      for (k in _ref2) {
        v = _ref2[k];
        for (_k = 0, _len3 = v.length; _k < _len3; _k++) {
          u = v[_k];
          u.user = k;
          if (k === 'gov') {
            gov_updates.push(u);
          } else {
            watch_updates.push(u);
          }
          if (u.links) {
            _ref3 = u.links;
            for (_l = 0, _len4 = _ref3.length; _l < _len4; _l++) {
              l = _ref3[_l];
              num_links[l.url] = true;
            }
          }
        }
      }
      rec.base.num_links = Object.keys(num_links).length;
      rec.gov_updates = gov_updates;
      rec.watch_updates = watch_updates;
    }
    all_tags = Object.keys(all_tags);
    all_subjects = Object.keys(all_subjects);
    all_books = Object.keys(all_books);
    if (localStorage) {
      localStorage.data = JSON.stringify(data);
      localStorage.all_books = JSON.stringify(all_books);
      localStorage.all_tags = JSON.stringify(all_tags);
      localStorage.all_subjects = JSON.stringify(all_subjects);
    }
    return process_data();
  };

  initialized = false;

  setup_searchbox = function() {
    var source, subject, tag, _i, _j, _len, _len2;
    show_watermark(true);
    $("#searchbox").change(function() {
      if (wm_shown) {
        search_term = "";
      } else {
        search_term = $("#searchbox").val();
      }
      return update_history();
    });
    $("#searchbox").focus(function() {
      return show_watermark(false);
    });
    $("#searchbox").blur(function() {
      if ($(this).val() === "") return show_watermark(true);
    });
    $("#searchbar").submit(function() {
      return false;
    });
    source = [];
    for (_i = 0, _len = all_tags.length; _i < _len; _i++) {
      tag = all_tags[_i];
      source.push({
        type: "tag",
        title: tag
      });
    }
    for (_j = 0, _len2 = all_subjects.length; _j < _len2; _j++) {
      subject = all_subjects[_j];
      source.push({
        type: "subject",
        title: subject
      });
    }
    return $("#searchbox").typeahead({
      source: source,
      items: 20,
      matcher: function(item) {
        return ~item.title.indexOf(this.query);
      },
      valueof: function(item) {
        return item.title;
      },
      selected: function(val) {
        search_term = val;
        return update_history();
      },
      highlighter: function(item) {
        var highlighted_title;
        highlighted_title = item.title.replace(new RegExp('(' + this.query + ')', 'ig'), function($1, match) {
          return '<strong>' + match + '</strong>';
        });
        if (item.type === "subject") return highlighted_title;
        if (item.type === "tag") {
          return "<span class='searchtag'><span>" + highlighted_title + "</span></span>";
        }
      }
    });
  };

  run_templates = function(template, data, selector) {
    var do_list, html, list_template;
    template = $("script[name=" + template + "]").html();
    list_template = $("script[name=list]").html();
    do_list = function(text) {
      return Mustache.to_html(list_template, {
        items: text,
        linkify: function() {
          return function(text, render) {
            text = render(text);
            return text = text.replace(/\[(.+)\]/, "<a href='$1'>\u05e7\u05d9\u05e9\u05d5\u05e8</a>");
          };
        }
      });
    };
    html = Mustache.to_html(template, data, {
      none_val: function() {
        return function(text, render) {
          text = render(text);
          if (text === "") {
            return "\u05d0\u05d9\u05df";
          } else {
            return text;
          }
        };
      },
      semicolon_list: function() {
        return function(text, render) {
          text = render(text);
          text = text.split(';');
          return text = do_list(text);
        };
      },
      urlforslug: function() {
        return function(text, render) {
          text = render(text);
          return generate_url(text);
        };
      }
    });
    return $(selector).html(html);
  };

  process_data = function() {
    var book, modal_options, ___iced_passed_deferral, __iced_deferrals, _i, _len,
      _this = this;
    ___iced_passed_deferral = iced.findDeferral(arguments);
    if (initialized) return;
    initialized = true;
    for (_i = 0, _len = all_books.length; _i < _len; _i++) {
      book = all_books[_i];
      $("#books").prepend("<li data-book='" + book + "' class='book'><a href='#'>" + book + "</a></li>");
    }
    run_templates("item", {
      items: loaded_data
    }, "#items");
    $(".item").each(function() {
      var conflict, implementation_status, is_good_status, last_percent, max_numeric_date, min_numeric_date, pad, status, status_to_hebrew, timeline_items, today;
      pad = function(n) {
        if (n < 10) {
          return '0' + n;
        } else {
          return n;
        }
      };
      today = new Date();
      today = "" + (today.getFullYear()) + "/" + (pad(today.getMonth() + 1)) + "/" + (pad(today.getDate() + 1));
      $(this).find('.timeline .timeline-point.today').attr('data-date', today);
      timeline_items = $(this).find(".timeline .timeline-point");
      timeline_items.tsort({
        attr: 'data-date',
        order: 'asc'
      });
      timeline_items = $(this).find(".timeline .timeline-point");
      max_numeric_date = 0;
      min_numeric_date = 2100 * 372;
      timeline_items.each(function() {
        var d, date, day, month, numeric_date, year, _ref;
        date = $(this).attr('data-date');
        date = date.split(' ')[0].split('/');
        _ref = (function() {
          var _j, _len2, _results;
          _results = [];
          for (_j = 0, _len2 = date.length; _j < _len2; _j++) {
            d = date[_j];
            _results.push(parseInt(d, 10));
          }
          return _results;
        })(), year = _ref[0], month = _ref[1], day = _ref[2];
        numeric_date = (year * 372) + ((month - 1) * 31) + (day - 1);
        if (isNaN(numeric_date)) numeric_date = 2012 * 372;
        if (numeric_date > max_numeric_date) max_numeric_date = numeric_date + 1;
        if (numeric_date < min_numeric_date) min_numeric_date = numeric_date;
        return $(this).attr('data-date-numeric', numeric_date);
      });
      status_to_hebrew = function(status) {
        switch (status) {
          case "NEW":
            return "טרם התחיל";
          case "STUCK":
            return "תקוע";
          case "IN_PROGRESS":
            return "בתהליך";
          case "FIXED":
            return "יושם במלואו";
          case "WORKAROUND":
            return "יושם חלקית";
          case "IRRELEVANT":
            return "יישום ההמלצה כבר לא נדרש";
        }
      };
      is_good_status = function(status) {
        switch (status) {
          case "NEW":
            return false;
          case "STUCK":
            return false;
          case "IN_PROGRESS":
            return true;
          case "FIXED":
            return true;
          case "WORKAROUND":
            return false;
          case "IRRELEVANT":
            return true;
        }
      };
      status = 'NEW';
      last_percent = 10.0;
      conflict = false;
      timeline_items.each(function() {
        var current_status, date, percent, _ref;
        date = parseInt($(this).attr('data-date-numeric'));
        percent = (date - min_numeric_date) / (max_numeric_date - min_numeric_date) * 75.0 + 10.0;
        $(this).css("top", percent + "%");
        if (percent !== last_percent) {
          $(this).before("<li class='timeline-line status-" + status + "'></li>");
          $(this).parent().find('.timeline-line:last').css('height', (percent - last_percent) + "%");
          $(this).parent().find('.timeline-line:last').css('top', last_percent + "%");
        }
        current_status = (_ref = $(this).attr('data-status')) != null ? _ref : status;
        if ($(this).hasClass('gov-update')) {
          conflict = false;
          status = current_status != null ? current_status : status;
        }
        if ($(this).hasClass('watch-update')) {
          if (is_good_status(current_status) !== is_good_status(status)) {
            conflict = true;
          }
        }
        $(this).find('.implementation-status').addClass("label-" + current_status);
        $(this).find('.implementation-status').html(status_to_hebrew(current_status));
        return last_percent = percent;
      });
      implementation_status = $(this).find('.gov-update:last').attr('data-status');
      if (conflict) {
        return $(this).find('.buxa-header').addClass('conflict');
      } else {
        $(this).find('.buxa-header').removeClass('conflict');
        if (is_good_status(implementation_status)) {
          return $(this).find('.buxa-header').addClass('good');
        } else {
          return $(this).find('.buxa-header').addClass('bad');
        }
      }
    });
    (function(__iced_k) {
      __iced_deferrals = new iced.Deferrals(__iced_k, {
        parent: ___iced_passed_deferral,
        filename: 'gov-watch.iced',
        funcname: 'process_data'
      });
      setTimeout((__iced_deferrals.defer({
        assign_fn: (function() {
          return function() {
            return __iced_deferrals.ret = arguments[0];
          };
        })(),
        lineno: 327
      })), 50);
      __iced_deferrals._fulfill();
    })(function() {
      $.Isotope.prototype._positionAbs = function(x, y) {
        return {
          right: x,
          top: y
        };
      };
      $("#items").isotope({
        itemSelector: '.item',
        layoutMode: 'masonry',
        transformsEnabled: false,
        filter: ".shown",
        getSortData: {
          chapter: function(e) {
            return e.find('.chapter-text').text();
          },
          recommendation: function(e) {
            return e.find('.recommendation-text').text();
          },
          budget: function(e) {
            return -parseInt("0" + e.attr('cost'), 10);
          },
          comments: function(e) {
            return -parseInt("0" + e.find('.fb_comments_count').text(), 10);
          }
        }
      });
      setup_searchbox();
      $("#books li.book a").click(function() {
        selected_book = $(this).html();
        return update_history();
      });
      $("#sort").change(function() {
        var sort_measure;
        sort_measure = $("#sort").val();
        return $("#items").isotope({
          sortBy: sort_measure
        });
      });
      window.onhashchange = onhashchange;
      onhashchange();
      modal_options = {
        backdrop: true,
        keyboard: true,
        show: false
      };
      $("#overview").modal(modal_options);
      return $("#overview-close").click(function() {
        return $("#overview").modal('hide');
      });
    });
  };

  select_item = function(slug) {
    var item, url, x, _i, _len, _results;
    $('fb\\:comments').remove();
    $('fb\\:like').remove();
    if (slug) {
      _results = [];
      for (_i = 0, _len = loaded_data.length; _i < _len; _i++) {
        x = loaded_data[_i];
        if (x.slug === slug) {
          item = run_templates("single-item", x, "#single-item");
          set_fb_title(x.base.book + ": " + x.base.subject);
          url = generate_url(slug);
          $("#single-item").append("<fb:like href='" + url + "' send='true' width='590' show_faces='true' action='recommend' font='tahoma'></fb:like>");
          $("#single-item").append("<fb:comments href='" + url + "' num_posts='2' width='590'></fb:comments>");
          if (window.FB) FB.XFBML.parse(item.get(0), function() {});
          break;
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    } else {
      return $("#single-item").html('');
    }
  };

  do_search = function() {
    var found, re, rec, should_show, slug, tag, x, _i, _j, _k, _len, _len2, _len3, _ref, _ref2;
    re = RegExp(search_term, "ig");
    for (_i = 0, _len = loaded_data.length; _i < _len; _i++) {
      rec = loaded_data[_i];
      slug = rec.slug;
      rec = rec.base;
      should_show = search_term === "";
      if (search_term !== "") {
        _ref = [rec["recommendation"], rec["subject"], rec["result_metric"], rec["title"], rec["chapter"], rec["subchapter"], rec["responsible_authority"]["main"], rec["responsible_authority"]["secondary"]];
        for (_j = 0, _len2 = _ref.length; _j < _len2; _j++) {
          x = _ref[_j];
          if (x) {
            found = x.indexOf(search_term) >= 0;
          } else {
            found = false;
          }
          should_show = should_show || found;
        }
        _ref2 = rec.tags;
        for (_k = 0, _len3 = _ref2.length; _k < _len3; _k++) {
          tag = _ref2[_k];
          if (tag === search_term) should_show = true;
        }
      }
      should_show = should_show && ((selected_book === "") || (rec.book === selected_book)) && (!selected_slug);
      $(".item[rel=" + slug + "]").toggleClass("shown", should_show);
    }
    return $("#items").isotope({
      filter: ".shown"
    });
  };

  load_data = function() {
    return $.get("/api", data_callback, "json");
  };

  $(function() {
    var current_version, version, ___iced_passed_deferral, __iced_deferrals,
      _this = this;
    ___iced_passed_deferral = iced.findDeferral(arguments);
    try {
      (function(__iced_k) {
        __iced_deferrals = new iced.Deferrals(__iced_k, {
          parent: ___iced_passed_deferral,
          filename: 'gov-watch.iced'
        });
        $.get("/api/version", (__iced_deferrals.defer({
          assign_fn: (function() {
            return function() {
              return version = arguments[0];
            };
          })(),
          lineno: 437
        })), "json");
        __iced_deferrals._fulfill();
      })(function() {
        current_version = localStorage.version;
        localStorage.version = JSON.stringify(version);
        if (current_version && version !== JSON.parse(current_version)) {
          loaded_data = JSON.parse(localStorage.data);
          all_books = JSON.parse(localStorage.all_books);
          all_tags = JSON.parse(localStorage.all_tags);
          all_subjects = JSON.parse(localStorage.all_subjects);
          return process_data();
        } else {
          return load_data();
        }
      });
    } catch (error) {
      return load_data();
    }
  });

}).call(this);
