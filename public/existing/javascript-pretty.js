var controller = {};
controller.showInterface = function() {
    if (1 == dataController.showVersionNumber) {
        controller.setUpCacheLogging()
    }
    window.applicationCache.addEventListener("updateready", controller.cacheUpdateReady, false);
    var a = parseInt(document.body.style.height);
    if (!a) {
        a = window.innerHeight
    }
    if (dataController.singleViewMode) {
        this.leftNavigationController = null;
        this.rightNavigationController = new ADNavigationController(null, this.viewControllerForAPDID("TOP_LEVEL_ITEM"))
    } else {
        var c = 300;
        this.leftNavigationController = new ADNavigationController(null, this.viewControllerForAPDID("TOP_LEVEL_ITEM"));
        this.leftNavigationController.view.size = new ADSize(c, a);
        this.leftNavigationController.delegate = this;
        this.leftNavigationController.view.delegate = this;
        this.leftNavigationController.view.zIndex = 2;
        this.leftNavigationController.view.autoresizingMask = ADViewAutoresizingFlexibleHeight;
        ADRootView.sharedRoot.addSubview(this.leftNavigationController.view);
        this.leftNavigationController.view.layer.id = "chaptersTable";
        this.rightNavigationController = new ADNavigationController(null, this.viewControllerForAPDID(null));
        this.rightNavigationController.view.size = new ADSize(window.innerWidth - c, a)
    }
    this.rightNavigationController.delegate = this;
    this.rightNavigationController.view.position = new ADPoint(c, 0);
    this.rightNavigationController.view.delegate = this;
    this.rightNavigationController.view.zIndex = 1;
    this.rightNavigationController.autoresizingMask = ADViewAutoresizingFlexibleWidth | ADViewAutoresizingFlexibleHeight;
    ADRootView.sharedRoot.addSubview(this.rightNavigationController.view);
    if (!dataController.singleViewMode) {
        var h = 0;
        if (window.location.hash) {
            var f = window.location.hash.replace("#", "");
            var e = dataController.getChildrenAPDIDsForItemWithAPDID("TOP_LEVEL_ITEM");
            h = e.indexOf(f)
        }
        if ( - 1 == h) {
            h = 0
        }
        var d = dataController.getChildrenAPDIDsForItemWithAPDID("TOP_LEVEL_ITEM")[h];
        setTimeout(function() {
            controller.navigateToElement(d, true)
        },
        1)
    }
    this.updateOrientation();
    if (dataController.webclipIcon) {
        var b = document.createElement("link");
        b.setAttribute("rel", "apple-touch-icon");
        b.setAttribute("href", dataController.dataFolder + dataController.webclipIcon);
        var g = document.getElementsByTagName("head")[0];
        g.appendChild(b)
    }
    setTimeout(function() {
        controller.addVoiceOverButton()
    },
    1)
};
controller.numberOfSectionsInTableView = function(a) {
    if (a._apdid == "TOP_LEVEL_ITEM") {
        return 1
    } else {
        if (a.style == ADTableViewStylePlain) {
            return 1
        } else {
            var d = dataController.getChildrenAPDIDsForItemWithAPDID(a._apdid);
            var c = false;
            for (var b = 0; child = d[b++];) {
                if (dataController.getChildrenAPDIDsForItemWithAPDID(child).length) {
                    c = true;
                    break
                }
            }
            var e = 0;
            if (!c) {
                e = 1
            } else {
                e = d.length
            }
            var f = dataController.getBodyForItemWithAPDID(a._apdid);
            if (f) {
                e++
            }
            return e
        }
    }
};
controller.tableViewNumberOfRowsInSection = function(e, h) {
    var b = dataController.getChildrenAPDIDsForItemWithAPDID(e._apdid);
    if (e._apdid == "TOP_LEVEL_ITEM") {
        var a = b.length;
        a += 1;
        if (localizationController.supportedLanguagesCount > 1) {
            a += 1
        }
        if (1 == dataController.showVersionNumber) {
            a += 4
        }
        return a
    } else {
        if (e.style == ADTableViewStylePlain) {
            return b.length
        } else {
            var j = dataController.getBodyForItemWithAPDID(e._apdid);
            if (j && h == 0) {
                return 0
            }
            var b = dataController.getChildrenAPDIDsForItemWithAPDID(e._apdid);
            var f = false;
            for (var d = 0; child = b[d++];) {
                if (dataController.getChildrenAPDIDsForItemWithAPDID(child).length) {
                    f = true;
                    break
                }
            }
            if (!f) {
                return b.length
            } else {
                var g = controller.tableViewTitleForHeaderInSection(e, h);
                if (g == "") {
                    return 1
                }
                for (var d in b) {
                    var c = b[d];
                    if (g == dataController.getTitleForItemWithAPDID(c)) {
                        return dataController.getChildrenAPDIDsForItemWithAPDID(c).length
                    }
                }
            }
            return 0
        }
    }
};
controller.tableViewCellForRowAtPath = function(e, g) {
    var n = new ADTableViewCell();
    n.selectionStyle = ADTableViewCellSelectionStyleNone;
    n.text = "";
    n.accessoryType = ADTableViewCellAccessoryDisclosureIndicator;
    n.selectionStyle = ADTableViewCellSelectionStyleBlue;
    rowIndex = g.row;
    if (e._apdid == "TOP_LEVEL_ITEM") {
        n.accessoryType = null;
        var j = dataController.getChildrenAPDIDsForItemWithAPDID("TOP_LEVEL_ITEM");
        var b = j[rowIndex];
        var m = dataController.getTitleForItemWithAPDID(b);
        var l = dataController.getIconForItemWithAPDID(b);
        if (l) {
            n.image = n.layer.appendChild(document.createElement("img"));
            n.image.setAttribute("src", l);
            n.image.setAttribute("class", "icon");
            n.layer.addClassName("topLevelCellWithImage")
        }
        if (localizationController.supportedLanguagesCount > 1 && rowIndex == j.length) {
            b = "LOCALIZATION_CONTENT";
            m = "";
            n.layer.children[1].innerHTML = '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAANCAYAAABy6+R8AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAATZJREFUeNqU0s9HRFEYxvG5cxPTDyVuylAiyiUiGpNoNYnSLqI/IFq1atMu/QGt2rVqU1pNSmlVWkRKEWkRESmlTAwxSn0fnsvddvg45/K+57zvOTeI4ziTGoNYRhF5POEMK7hJgrKe67GKHQd+WQ2PKHuzMJ20jj6MYBqzTpjBJAoYwpqCA8orMW/hGg8YcPI7WnHhEnsxhnEl7bHYwD0O8Ik2dOADL8hhDl2qREmvLLrdQwX9Dqz4pLxP60QT7pT0m/nfqGVdQoP6c2ntqXXg72TdjLc6N1nyVVdx7J5a8OxNq6m3O1F5E769SyfmfNVJT2Un6hKGMaWTDrHrepdw5R01evyXFPyW2zopedx51erS9n1y6FmbnuIWCwoOoyjS/I0jnEPljqLRvelJFrGJHwX/CTAAop9NZ356wJwAAAAASUVORK5CYII=" alt="Globe" />' + localizationController.localizedUIString("Change Language");
            n.layer.children[1].setAttribute("id", "localizationText")
        }
        if (((localizationController.supportedLanguagesCount > 1 && rowIndex == j.length + 1) || (localizationController.supportedLanguagesCount <= 1 && rowIndex == j.length))) {
            b = "COPYRIGHT_PAGE_CONTENT";
            m = "";
            var h = dataController.getBodyForItemWithAPDID("COPYRIGHT_TAGLINE");
            h = h.replace(/<\/p>/g, "<br />");
            h = h.replace(/<p.*?>/g, "");
            n.layer.children[1].innerHTML = h;
            n.layer.children[1].setAttribute("id", "trademarkText")
        }
        if (1 == dataController.showVersionNumber) {
            var k = controller.tableViewNumberOfRowsInSection(e, g.section);
            if (rowIndex == k - 4) {
                b = "";
                m = ""
            }
            if (rowIndex == k - 3) {
                if (typeof(window.buildVersion) == "undefined") {
                    buildVersion = "(unavailable)"
                }
                b = "";
                m = "ipad guide version '" + buildVersion + "'";
                n.layer.children[1].style.fontSize = "12px";
                n.layer.children[1].style.fontWeight = "normal";
                n.layer.children[1].style.paddingTop = "3px";
                n.layer.style.textAlign = "center"
            }
            if (rowIndex == k - 2) {
                b = "";
                m = "content version '" + dataController.databaseVersion + "'";
                n.layer.children[1].style.fontSize = "12px";
                n.layer.children[1].style.fontWeight = "normal";
                n.layer.children[1].style.paddingTop = "3px";
                n.layer.style.textAlign = "center"
            }
            if (rowIndex == k - 1) {
                b = "";
                m = "";
                n.layer.children[1].innerHTML = '<a href="../BuildInfo.txt">view build info file...</a>';
                n.layer.children[1].children[0].style.color = "black";
                n.layer.children[1].style.fontSize = "12px";
                n.layer.children[1].style.fontWeight = "normal";
                n.layer.children[1].style.paddingTop = "3px";
                n.layer.style.textAlign = "center"
            }
        }
    } else {
        if (e.style == ADTableViewStylePlain) {
            var a = dataController.getChildrenAPDIDsForItemWithAPDID(e._apdid);
            var b = a[rowIndex];
            var m = dataController.getTitleForItemWithAPDID(b);
            var l = dataController.getIconForItemWithAPDID(b)
        } else {
            var a = dataController.getChildrenAPDIDsForItemWithAPDID(e._apdid);
            var f = false;
            for (var d = 0; child = a[d++];) {
                if (dataController.getChildrenAPDIDsForItemWithAPDID(child).length) {
                    f = true;
                    break
                }
            }
            if (!f) {
                var b = a[rowIndex];
                var m = dataController.getTitleForItemWithAPDID(b)
            } else {
                sectionIndex = g.section;
                sectionIndexWithIntro = sectionIndex;
                var o = dataController.getBodyForItemWithAPDID(e._apdid);
                if (o) {
                    sectionIndexWithIntro--
                }
                var b = a[sectionIndexWithIntro];
                var p = controller.tableViewTitleForHeaderInSection(e, sectionIndex);
                if ("" == p) {
                    var m = dataController.getTitleForItemWithAPDID(b)
                } else {
                    var c = dataController.getChildrenAPDIDsForItemWithAPDID(b);
                    var m = dataController.getTitleForItemWithAPDID(c[rowIndex])
                }
            }
        }
    }
    n.id = b;
    if (m != "") {
        n.text = m
    }
    return n
};
controller.tableViewTitleForHeaderInSection = function(a, g) {
    if (a._apdid == "TOP_LEVEL_ITEM") {
        return null
    } else {
        if (a.style == ADTableViewStylePlain) {
            return null
        } else {
            var d = new Array();
            var f = g;
            var c = dataController.getChildrenAPDIDsForItemWithAPDID(a._apdid);
            var e = dataController.getBodyForItemWithAPDID(a._apdid);
            if (e && g == 0) {
                return null
            }
            if (e) {
                f--
            }
            for (var b in c) {
                var h = c[b];
                if (1 == dataController.getFlattenStateForItemWithAPDID(h)) {
                    d.push(dataController.getTitleForItemWithAPDID(h))
                } else {
                    d.push("")
                }
            }
            return d[f]
        }
    }
};
controller.tableViewTitleForFooterInSection = function(a, c) {
    if (a._apdid == "TOP_LEVEL_ITEM") {
        return null
    } else {
        if (a.style == ADTableViewStylePlain) {
            return null
        } else {
            var b = dataController.getBodyForItemWithAPDID(a._apdid);
            if (b && c == 0) {
                b = b.replace(/(<([^>]+)>)/ig, "");
                return b
            }
            return null
        }
    }
};
controller.tableViewDidSelectAccessoryForRowAtPath = function(a, b) {
    controller.tableViewDidSelectRowAtPath(a, b)
};
controller.tableViewDidSelectRowAtPath = function(g, o) {
    if (g._apdid == "TOP_LEVEL_ITEM") {
        rowIndex = o.row;
        var k = dataController.getChildrenAPDIDsForItemWithAPDID("TOP_LEVEL_ITEM");
        var c = k[rowIndex];
        if (!c) {
            var m = this.tableViewCellForRowAtPath(g, o);
            c = m.id
        }
        if (!c || c == "undefined") {
            return
        }
        var a = this.rightNavigationController.topViewController._apdid;
        var d = dataController.getChapterAPDIDForItemWithAPDID(a);
        if (d == c) {
            return
        }
        this.navigateToElement(c, true);
        if (dataController.singleViewMode) {
            setTimeout(function() {
                g.deselectRowAtPathAnimated(o, true)
            },
            ADTransitionDefaults.duration * 1000)
        }
    } else {
        if (g.style == ADTableViewStylePlain) {
            rowIndex = o.row;
            var b = dataController.getChildrenAPDIDsForItemWithAPDID(g._apdid);
            var c = b[rowIndex];
            if (!c) {
                var j = g.delegate.tableViewCellForRowAtPath(g, o).id;
                if (j != "") {
                    c = j
                }
            }
        } else {
            var b = dataController.getChildrenAPDIDsForItemWithAPDID(g._apdid);
            var h = false;
            for (var f = 0; child = b[f++];) {
                if (dataController.getChildrenAPDIDsForItemWithAPDID(child).length) {
                    h = true;
                    break
                }
            }
            rowIndex = o.row;
            if (!h) {
                var c = b[rowIndex]
            } else {
                sectionIndex = o.section;
                sectionIndexWithIntro = sectionIndex;
                var l = dataController.getBodyForItemWithAPDID(g._apdid);
                if (l) {
                    sectionIndexWithIntro--
                }
                var n = controller.tableViewTitleForHeaderInSection(g, sectionIndex);
                var c = b[sectionIndexWithIntro];
                if ("" != n) {
                    var e = dataController.getChildrenAPDIDsForItemWithAPDID(c);
                    c = e[rowIndex]
                }
            }
        }
        if (c) {
            this.navigateToElement(c, false)
        }
        setTimeout(function() {
            g.deselectRowAtPathAnimated(o, true)
        },
        ADTransitionDefaults.duration * 1000)
    }
};
controller.navigationControllerDidShowViewControllerAnimated = function(a, f, e) {
    var g = f._apdid;
    var d = dataController.getChapterAPDIDForItemWithAPDID(g);
    var c = dataController.getChildrenAPDIDsForItemWithAPDID("TOP_LEVEL_ITEM");
    var b = c.indexOf(d);
    if (b < 0) {
        return
    }
    this.leftNavigationController.topViewController.view._listView.selectRowAtPath(new ADCellPath(0, b))
};
openCrossReference = function(a) {
    controller.navigateToElement(a, false)
};
controller.navigateToElement = function(e, c) {
    var b = this.viewControllerForAPDID(e);
    var a = null;
    if (e == "TOP_LEVEL_ITEM") {
        a = controller.leftNavigationController
    } else {
        a = controller.rightNavigationController
    }
    var d = dataController.getParentAPDIDForItemWithAPDID(e);
    if (!dataController.singleViewMode && c == true) {
        a.setViewControllersAnimated([b], false)
    } else {
        a.pushViewControllerAnimated(b, true)
    }
};
controller.addVoiceOverButton = function() {
    var b = new XMLHttpRequest();
    var e = window.location.toString();
    var f = e.lastIndexOf("/");
    if (f != -1) {
        e = e.substring(0, f + 1)
    }
    e += "../voiceover/" + localizationController.language + "/index.html";
    b.open("GET", e, false);
    try {
        b.send(null)
    } catch(d) {
        b = null
    }
    if (!b || !(b.status == 0 || b.status == 200)) {
        console.log("No VoiceOver guide index available.");
        return
    }
    if ("" == b.responseText) {
        console.log("No VoiceOver content available.");
        return
    }
    var a = document.createElement("div");
    a.style.width = "0px";
    a.style.height = "0px";
    a.style.overflow = "hidden";
    a.id = "voiceOverButton";
    document.body.appendChild(a);
    document.body.insertBefore(a, document.body.firstChild);
    var c = document.createElement("a");
    c.setAttribute("onClick", "window.location = '" + e + "'");
    c.style.position = "absolute";
    c.style.zIndex = "1000";
    c.style.background = "transparent";
    c.style.display = "block";
    c.style.width = "5px";
    c.style.height = "5px";
    c.style.fontSize = "2px";
    c.style.overflow = "hidden";
    c.style.color = "transparent";
    c.appendChild(document.createTextNode("Voice Over users click here."));
    a.appendChild(c)
};
controller.showSearchResultsView = function(a) {
    this.rightNavigationController.pushViewControllerAnimated(a, true)
};
controller.viewControllerForAPDID = function(f) {
    var e = new ADViewController();
    e.view = new ADView();
    e._apdid = f;
    var c = dataController.getChildrenAPDIDsForItemWithAPDID(f);
    if (!f) {
        e.view.layer.className = "initializingViewController"
    } else {
        if (f == "LOCALIZATION_CONTENT") {
            var b = localizationController.getLanguagesView();
            e.view.addSubview(b);
            e.title = ""
        } else {
            if (c.length != 0) {
                var a = controller.createListWithAPDID(f);
                e.view.addSubview(a);
                e.view._listView = a;
                e.title = dataController.getTitleForItemWithAPDID(f)
            } else {
                var d = controller.createContentViewWithAPDID(f);
                e.view.addSubview(d);
                e.view._contentView = d;
                e.title = dataController.getTitleForItemWithAPDID(f)
            }
        }
    }
    if (!dataController.singleViewMode && f == "TOP_LEVEL_ITEM") {
        controller.chapterListView = a;
        e.becomesBackItemTransition = null;
        e.wasBackItemTransition = null
    } else {
        e.navigationItem.rightBarButtonItem = searchController.getSearchItem()
    }
    if (f == "TOP_LEVEL_ITEM" && "" != dataController.mainTOCBackButtonURL && "" != dataController.mainTOCBackButtonTitle) {
        if (!controller.mainTOCBackButton) {
            controller.mainTOCBackButton = new ADBarButtonItem(ADBarButtonItemTypeBack);
            controller.mainTOCBackButton.title = dataController.mainTOCBackButtonTitle;
            controller.mainTOCBackButton.addEventListener("controlTouchUpInside",
            function() {
                window.location = dataController.mainTOCBackButtonURL
            },
            false)
        }
        if (controller.mainTOCBackButton) {
            e.navigationItem.leftBarButtonItem = controller.mainTOCBackButton
        }
    }
    return e
};
controller.createListWithAPDID = function(b) {
    var a = new ADTableView();
    a.autoresizingMask = ADViewAutoresizingFlexibleWidth | ADViewAutoresizingFlexibleHeight;
    a.separatorStyle = ADTableViewCellSeparatorStyleSingleLineEtched;
    a._apdid = b;
    a.scrollIndicatorsColor = "#333";
    if (dataController.shouldFlatten && b != "TOP_LEVEL_ITEM") {
        a.style = ADTableViewStyleGrouped
    } else {
        a.style = ADTableViewStylePlain
    }
    a.dataSource = this;
    a.delegate = this;
    a.reloadData();
    return a
};
controller.createContentViewWithAPDID = function(f) {
    var j = new ADScrollView();
    j.autoresizingMask = ADViewAutoresizingFlexibleWidth | ADViewAutoresizingFlexibleHeight;
    j.horizontalScrollEnabled = false;
    j.scrollIndicatorsColor = "#333";
    j._isContent = true;
    j.layer.id = "contentScrollView";
    var a = document.createElement("div");
    a.className = "content";
    j.addSubview(new ADContentView(a));
    a.innerHTML = '<div class="Name">' + dataController.getTitleForItemWithAPDID(f) + "</div>";
    a.innerHTML += dataController.getBodyForItemWithAPDID(f);
    var g = a.getElementsByTagName("img");
    for (var d = 0; d < g.length; d++) {
        var b = g[d];
        var l = b.src;
        l = l.substring(l.indexOf("Art/"), l.length);
        var e = dataController.getBase64ForImageAtPath(l);
        if (e != undefined) {
            b.setAttribute("src", "data:image/png;base64," + e)
        }
        b.setAttribute("onLoad", "javascript:controller.refreshContentViewSize();");
        b.setAttribute("onError", "javascript:controller.errorLoadingGraphic(this);")
    }
    var k = a.getElementsByTagName("a");
    for (var d = 0; d < k.length; d++) {
        var h = k[d];
        var c = h.href;
        if ("#" == c) {
            continue
        }
        h.target = "_new"
    }
    setTimeout(function() {
        controller.refreshContentViewSize()
    },
    1);
    return j
};
controller.errorLoadingGraphic = function(b) {
    var a = document.createElement("span");
    a.appendChild(document.createTextNode(" [ Missing image: " + b.alt));
    a.appendChild(document.createComment(b.src));
    a.appendChild(document.createTextNode(" ] "));
    b.parentNode.replaceChild(a, b)
};
controller.updateOrientation = function() {
    document.body.removeClassName("portrait");
    document.body.removeClassName("landscape");
    switch (window.orientation) {
    case 0:
    case 180:
        document.body.addClassName("portrait");
        break;
    case 90:
    case - 90: document.body.addClassName("landscape");
        break
    }
    searchController.resizeSearchField();
    setTimeout(function() {
        controller.refreshContentViewSize()
    },
    100)
};
window.onorientationchange = controller.updateOrientation;
controller.refreshContentViewSize = function() {
    var d = this.rightNavigationController.topViewController._view._contentView;
    if (d) {
        var b = d.subviews[0];
        var f = d.contentOffset.y;
        var a = d.contentSize.height;
        var c = (f) / a;
        b.refreshSize();
        b._size = new ADSize(b._size.width, b._size.height + 50);
        var e = (c * d.contentSize.height);
        d.setContentOffsetWithAnimation(new ADPoint(0, e), false)
    }
};
controller.cacheUpdateReady = function() {
    window.applicationCache.swapCache()
};
controller.setUpCacheLogging = function() {
    console.log("CACHING: setting up logging...");
    b = window.applicationCache;
    function a(h) {
        var c = [];
        c[0] = "uncached";
        c[1] = "idle";
        c[2] = "checking";
        c[3] = "downloading";
        c[4] = "updateready";
        c[5] = "obsolete";
        var e = (navigator.onLine) ? "yes": "no";
        var d = c[b.status];
        var f = h.type;
        var g = "CACHING: online: " + e + " ----- ";
        g += "event: " + f + " ----- ";
        g += "status: " + d + " ----- ";
        if (f == "error" && navigator.onLine) {
            g += "(probably a syntax error in manifest)"
        }
        console.log(g)
    }
    var b = window.applicationCache;
    b.addEventListener("cached", a, false);
    b.addEventListener("checking", a, false);
    b.addEventListener("downloading", a, false);
    b.addEventListener("error", a, false);
    b.addEventListener("noupdate", a, false);
    b.addEventListener("obsolete", a, false);
    b.addEventListener("updateready", a, false)
};
var dataController = {
    database: null,
    table: new Array(),
    titleTable: new Object(),
    childrenTable: new Object(),
    parentTable: new Object(),
    graphics: new Array(),
    graphicCacheFromJSON: null,
    databaseVersion: 0,
    configurationSettings: new Object(),
    shouldFlatten: 0,
    shouldHideSearchButton: 0,
    mainTOCBackButtonURL: "",
    mainTOCBackButtonTitle: "",
    title: "",
    alternativeTitle: "",
    showVersionNumber: 0,
    webclipIcon: 0,
    singleViewMode: 0,
};
dataController.init = function() {
    localizationController.localize();
    var a = localizationController.language;
    var b = window.location.href;
    this.dataFolder = b;
    this.dataFolder = this.dataFolder.substring(0, this.dataFolder.lastIndexOf("/"));
    this.dataFolder = this.dataFolder.substring(0, this.dataFolder.lastIndexOf("/"));
    this.dataFolder += "/Contents/" + a + "/";
    this.dataFolder = this.dataFolder.replace(" ", "%20");
    dataController.initDatabase()
};
dataController.fixNestedSingularChildren = function() {
    for (var b in dataController.childrenTable) {
        var f = dataController.childrenTable[b];
        if (1 != f.length) {
            continue
        }
        if ("TOP_LEVEL_ITEM" == b) {
            continue
        }
        var c = f[0];
        delete dataController.childrenTable[b];
        for (var d in dataController.childrenTable) {
            var e = dataController.childrenTable[d];
            for (var a = 0; a < e.length; a++) {
                if (e[a] == b) {
                    e[a] = c
                }
            }
        }
    }
};
dataController.getChildrenAPDIDsForItemWithAPDID = function(b) {
    if (b == undefined) {
        b = ""
    }
    var a = this.childrenTable[b];
    if (!a) {
        a = new Array()
    }
    return a
};
dataController.getTitleForItemWithAPDID = function(c) {
    if (c == "TOP_LEVEL_ITEM") {
        var a = dataController.title;
        if (dataController.alternativeTitle) {
            a = dataController.alternativeTitle
        }
        if (!a || a.length == 0) {
            a = " "
        }
        return a
    }
    if (c == "COPYRIGHT_PAGE_CONTENT") {
        return "Copyright"
    }
    if (c == "") {
        return "ERROR! item missing apdid"
    }
    var b = this.titleTable[c];
    if (b) {
        b = this.removeEntities(b)
    }
    return b
};
dataController.getIconForItemWithAPDID = function(d) {
    if (d == "") {
        return "ERROR! item missing apdid"
    }
    for (var b in this.table) {
        var c = this.table[b];
        if (c.apdid == d) {
            var a = c.icon;
            a = a.replace("Art/", "../Contents/" + localizationController.language + "/Art/");
            return a
        }
    }
};
dataController.getFlattenStateForItemWithAPDID = function(c) {
    if (c == "" || c == undefined) {
        return ""
    }
    for (var a in this.table) {
        var b = this.table[a];
        if (b.apdid == c) {
            return b.flatten
        }
    }
};
dataController.getBodyForItemWithAPDID = function(d) {
    for (var a in this.table) {
        var c = this.table[a];
        if (c.apdid == d) {
            var b = c.content;
            b = b.replace(/Art\//g, "../Contents/" + localizationController.language + "/Art/");
            return b
        }
    }
    return ""
};
dataController.getBase64ForImageAtPath = function(b) {
    for (var a in this.graphics) {
        var c = this.graphics[a];
        if (c.artPath == b) {
            return c.base64
        }
    }
};
dataController.getParentAPDIDForItemWithAPDID = function(a) {
    if (a == "" || a == undefined) {
        return ""
    }
    return this.parentTable[a]
};
dataController.getChapterAPDIDForItemWithAPDID = function(b) {
    var a = b;
    while (a && this.getParentAPDIDForItemWithAPDID(a) != "TOP_LEVEL_ITEM") {
        a = this.getParentAPDIDForItemWithAPDID(a)
    }
    return a
};
dataController.getBreadcrumbsForItemWithAPDID = function(c) {
    var b = "";
    var a = this.getParentAPDIDForItemWithAPDID(c);
    while (a != "TOP_LEVEL_ITEM") {
        b = this.getTitleForItemWithAPDID(a) + " > " + b;
        a = this.getParentAPDIDForItemWithAPDID(a)
    }
    b = b.substring(0, b.length - 2);
    return b
};
dataController.removeEntities = function(a) {
    a = a.replace(/&amp;/g, "&");
    a = a.replace(/&lt;/g, "<");
    a = a.replace(/&gt;/g, ">");
    return a
};
function dataControllerInit() {
    dataController.init()
}
window.addEventListener("load", dataControllerInit, false);
dataController.initDatabase = function() {
    try {
        if (!window.openDatabase) {
            alert("not supported")
        } else {
            var g = window.location.toString();
            var d = g.lastIndexOf("/");
            if (d != -1) {
                g = g.substring(0, d + 1)
            }
            var a = "User Guide - " + g;
            var c = "1.0";
            var b = "User Guide";
            var h = 65536;
            this.database = openDatabase(a, c, b, h)
        }
    } catch(f) {
        alert("Unknown error " + f + ".");
        return
    }
    this.checkDatabaseVersion()
};
dataController.checkDatabaseVersion = function() {
    this.database.transaction(function(e) {
        var a = new XMLHttpRequest();
        var c = dataController.dataFolder + "contentjson-version.txt";
        a.open("GET", c, false);
        try {
            a.send(null)
        } catch(b) {
            a = null
        }
        if (!a || !(a.status == 0 || a.status == 200)) {
            console.log("Error retrieving JSON Version file.");
            var d = ""
        } else {
            var d = a.responseText
        }
        e.executeSql("SELECT * FROM " + localizationController.language + 'Config WHERE key="version"', [],
        function(h, f) {
            var g = f.rows.item(0).value;
            dataController.databaseVersion = g;
            if (g == d || d == "") {
                dataController.createDataStructure();
                dataController.createGraphicsDataStructure();
                return
            }
            h.executeSql("DROP TABLE IF EXISTS " + localizationController.language + "Content;", [], null, dataController.errorHandler);
            h.executeSql("DROP TABLE IF EXISTS " + localizationController.language + "Config;", [], null, dataController.errorHandler);
            h.executeSql("DROP TABLE IF EXISTS " + localizationController.language + "Graphics;", [], null, dataController.errorHandler);
            dataController.updateDatabaseVersion(d)
        },
        function(g, f) {
            dataController.updateDatabaseVersion(d)
        })
    })
};
dataController.updateDatabaseVersion = function(a) {
    this.database.transaction(function(b) {
        dataController.databaseVersion = a;
        b.executeSql("CREATE TABLE " + localizationController.language + "Config (key TEXT NOT NULL, value TEXT NOT NULL);", [], null, dataController.errorHandler);
        b.executeSql("insert into " + localizationController.language + "Config (key, value) VALUES (?, ?);", ["version", a], null, dataController.errorHandler);
        dataController.createTable();
        dataController.createGraphicsTable()
    })
};
dataController.createTable = function() {
    this.database.transaction(function(transaction) {
        console.log("Loaded new JSON data into the Database.");
        var jsonRequest = new XMLHttpRequest();
        var jsonURL = dataController.dataFolder + "content.json";
        jsonRequest.open("GET", jsonURL, false);
        try {
            jsonRequest.send(null)
        } catch(err) {
            jsonRequest = null
        }
        if (!jsonRequest || !(jsonRequest.status == 0 || jsonRequest.status == 200)) {
            console.log("Error retrieving JSON file.");
            return
        }
        try {
            var jsonObject = jsonRequest.responseText;
            eval(jsonObject);
            dataController.graphicCacheFromJSON = graphicCache
        } catch(err) {
            if (localizationController.language != "en") {
                document.location = "?lang=en"
            } else {
                alert("English content.json could not be parsed.")
            }
            return
        }
        transaction.executeSql("CREATE TABLE " + localizationController.language + "Content (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, apdid TEXT NOT NULL, parentapdid TEXT NOT NULL, flatten TEXT NOT NULL, title TEXT NOT NULL, icon TEXT NOT NULL, keywords TEXT NOT NULL, content TEXT NOT NULL);", [], null, dataController.errorHandler);
        addItemsInArrayWithParentAPDID(jsonArray, "TOP_LEVEL_ITEM");
        function addItemsInArrayWithParentAPDID(array, parentAPDID) {
            for (var i in array) {
                var item = array[i];
                var flatten = 0;
                if (item.flatten && item.children && item.children.length != 0) {
                    flatten = 1
                }
                var name = item.name;
                var icon = item.icon;
                var keywords = item.keywords;
                var content = item.content;
                if (typeof(name) == "undefined") {
                    name = ""
                }
                if (typeof(icon) == "undefined") {
                    icon = ""
                }
                if (typeof(keywords) == "undefined") {
                    keywords = ""
                }
                if (typeof(content) == "undefined") {
                    content = ""
                }
                if (content == "" && item.intro) {
                    content = item.intro
                }
                addEntryToContentDatabase(item.apdid, parentAPDID, flatten, name, icon, keywords, content);
                if (item.children && item.children.length != 0) {
                    addItemsInArrayWithParentAPDID(item.children, item.apdid)
                }
            }
        }
        function addEntryToContentDatabase(apdid, parentapdid, flatten, title, icon, keywords, content) {
            transaction.executeSql("insert into " + localizationController.language + "Content (apdid, parentapdid, flatten, title, icon, keywords, content) VALUES (?, ?, ?, ?, ?, ?, ?);", [apdid, parentapdid, flatten, title, icon, keywords, content], null, dataController.errorHandler)
        }
        for (var key in configurationSettings) {
            var value = configurationSettings[key];
            transaction.executeSql("insert into " + localizationController.language + "Config (key, value) VALUES (?, ?);", [key, value], null, dataController.errorHandler)
        }
        dataController.createDataStructure()
    })
};
dataController.createGraphicsTable = function() {
    this.database.transaction(function(d) {
        console.log("Loaded new Graphics data into the Database.");
        d.executeSql("CREATE TABLE " + localizationController.language + "Graphics (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, artPath TEXT NOT NULL, base64 TEXT NOT NULL);", [], null, dataController.errorHandler);
        var b = dataController.graphicCacheFromJSON;
        if (typeof(b) != "undefined") {
            for (var a in b) {
                var c = b[a];
                e(a, c)
            }
        }
        function e(g, f) {
            d.executeSql("insert into " + localizationController.language + "Graphics (artPath, base64) VALUES (?, ?);", [g, f], null, dataController.errorHandler)
        }
        dataController.createGraphicsDataStructure()
    })
};
dataController.createDataStructure = function() {
    this.database.transaction(function(a) {
        a.executeSql("select * from " + localizationController.language + "Content;", [],
        function(e, b) {
            for (var c = 0; c < b.rows.length; c++) {
                var d = b.rows.item(c);
                dataController.table.push(d);
                dataController.titleTable[d.apdid] = d.title;
                dataController.parentTable[d.apdid] = d.parentapdid;
                if (!dataController.childrenTable[d.parentapdid]) {
                    dataController.childrenTable[d.parentapdid] = new Array()
                }
                if (d.apdid != "COPYRIGHT_PAGE_CONTENT" && d.apdid != "COPYRIGHT_TAGLINE") {
                    dataController.childrenTable[d.parentapdid].push(d.apdid)
                }
            }
            dataController.fixNestedSingularChildren();
            dataController.database.transaction(function(f) {
                f.executeSql("select * from " + localizationController.language + "Config;", [],
                function(k, g) {
                    for (var h = 0; h < g.rows.length; h++) {
                        var j = g.rows.item(h);
                        dataController.configurationSettings[j.key] = j.value;
                        if (j.key == "MenuStructure" && j.value == "Type=grouped,") {
                            dataController.shouldFlatten = 1
                        }
                        if (j.key == "Search" && j.value == "disabled=true,") {
                            dataController.shouldHideSearchButton = 1
                        }
                        if (j.key == "BackButtonURL" && j.value != "" && j.value != "BackButtonURL") {
                            dataController.mainTOCBackButtonURL = j.value
                        }
                        if (j.key == "BackButtonTitle" && j.value != "" && j.value != "BackButtonTitle") {
                            dataController.mainTOCBackButtonTitle = j.value
                        }
                        if (j.key == "Title" && j.value != "") {
                            dataController.title = j.value;
                            document.title = dataController.title
                        }
                        if (j.key == "AlternativeTitle" && j.value != "") {
                            dataController.alternativeTitle = j.value
                        }
                        if (j.key == "ShowVersionNumber" && j.value == "1") {
                            dataController.showVersionNumber = 1
                        }
                        if (j.key == "WebclipIcon") {
                            dataController.webclipIcon = j.value
                        }
                        if (j.key == "View" && j.value == "Type=single-view,") {
                            dataController.singleViewMode = 1
                        }
                    }
                    controller.showInterface()
                },
                dataController.errorHandler)
            })
        },
        dataController.errorHandler)
    })
};
dataController.createGraphicsDataStructure = function() {
    this.database.transaction(function(a) {
        a.executeSql("select * from " + localizationController.language + "Graphics;", [],
        function(d, b) {
            for (var c = 0; c < b.rows.length; c++) {
                dataController.graphics.push(b.rows.item(c))
            }
        },
        dataController.errorHandler)
    })
};
dataController.performSearchWithQuery = function(b, a) {
    if (b == "" || b.length < 2) {
        a(new Array());
        return
    }
    b = b.replace(/^\s\s*/, "").replace(/\s\s*$/, "");
    searchQueryArray = b.split(" ");
    searchQueryContentLikeClause = '( content LIKE "%' + searchQueryArray.join('%" AND content LIKE "%') + '%" )';
    searchQueryTitleLikeClause = '( title LIKE "%' + searchQueryArray.join('%" AND title LIKE "%') + '%" )';
    searchQueryKeywordsLikeClause = '( keywords LIKE "%' + searchQueryArray.join('%" AND keywords LIKE "%') + '%" )';
    this.database.transaction(function(d) {
        var c = "SELECT * FROM " + localizationController.language + "Content WHERE " + searchQueryContentLikeClause + " OR " + searchQueryTitleLikeClause + " OR " + searchQueryKeywordsLikeClause + " LIMIT 25";
        d.executeSql(c, [],
        function(j, e) {
            var h = new Array();
            for (var g = 0; g < e.rows.length; g++) {
                var f = e.rows.item(g).apdid;
                if (0 == dataController.getChildrenAPDIDsForItemWithAPDID(f).length) {
                    h.push(f)
                }
            }
            a(h)
        },
        dataController.errorHandler)
    })
};
dataController.errorHandler = function(b, a) {
    console.log("Error Handler: " + a.message + " (" + a.code + ")");
    if ( - 1 != a.message.indexOf("no such table")) {
        dataController.database.transaction(function(c) {
            c.executeSql("DROP TABLE IF EXISTS " + localizationController.language + "Content;", [], null, dataController.errorHandler);
            c.executeSql("DROP TABLE IF EXISTS " + localizationController.language + "Config;", [], null, dataController.errorHandler);
            c.executeSql("DROP TABLE IF EXISTS " + localizationController.language + "Graphics;", [], null, dataController.errorHandler);
            window.location.reload()
        })
    }
    return true
};
var localizationController = {
    didLoadJSON: 0,
    language: null
};
localizationController.init = function() {
    if (this.didLoadJSON) {
        return
    }
    var currentURL = window.location.href;
    dataFolder = currentURL;
    dataFolder = dataFolder.substring(0, dataFolder.lastIndexOf("/"));
    dataFolder = dataFolder.substring(0, dataFolder.lastIndexOf("/"));
    dataFolder += "/Contents/";
    var infoJsonRequest = new XMLHttpRequest();
    var infoJsonURL = dataFolder + "Info.json";
    infoJsonRequest.open("GET", infoJsonURL, false);
    try {
        infoJsonRequest.send(null)
    } catch(err) {
        infoJsonRequest = null
    }
    if (!infoJsonRequest || !(infoJsonRequest.status == 0 || infoJsonRequest.status == 200)) {
        console.log("Error retrieving Info.json file.");
        this.supportedLanguages = new Array;
        return
    }
    this.didLoadJSON = 1;
    var infoJsonContents = eval(infoJsonRequest.responseText);
    infoJsonContents = infoJsonContents[0];
    this.supportedLanguages = infoJsonContents;
    this.supportedLanguagesCount = 0;
    for (var key in this.supportedLanguages) {
        this.supportedLanguagesCount += 1
    }
    localizationController.initializeUIElements()
};
localizationController.localize = function() {
    localizationController.init();
    var e = window.location.search;
    if (e.length > 0) {
        e = e.substring(1, e.length)
    } else {
        e = null
    }
    var d = new Object();
    if (e) {
        for (var c = 0; c < e.split("&").length; c++) {
            var b = e.split("&")[c];
            d[b.split("=")[0]] = b.split("=")[1]
        }
    }
    var f = d.lang;
    if (f) {
        this.language = f
    } else {
        var a = navigator.language.substring(0, 2);
        if ("zh" == a) {
            if ("zh-cn" == navigator.language) {
                a = "zh_CN"
            } else {
                if ("zh-tw" == navigator.language) {
                    a = "zn_TW"
                }
            }
        } else {
            if ("pt" == a) {
                if ("pt-br" == navigator.language) {
                    a = "pt_BR"
                } else {
                    if ("pt-pt" == navigator.language) {
                        a = "pt"
                    }
                }
            }
        }
        if (a && this.supportedLanguages[a]) {
            this.language = a
        } else {
            this.language = "en"
        }
    }
    if (this.language == "he") {
        document.getElementsByTagName("html")[0].setAttribute("dir", "rtl")
    }
};
localizationController.localizedUIString = function(c) {
    var b = localizationController.uiElements[localizationController.language];
    if (!b) {
        return c
    }
    var a = b[c];
    if (!a) {
        return c
    }
    return a
};
localizationController.getLanguagesView = function() {
    localizationController.languages = new Array();
    localizationController.languageView = new ADContentView(document.createElement("div"));
    localizationController.languageView.autoresizingMask = ADViewAutoresizingFlexibleWidth | ADViewAutoresizingFlexibleHeight;
    localizationController.languageView.layer.style.backgroundColor = "white";
    localizationController.languageListView = new ADTableView();
    localizationController.languageListView.style = ADTableViewStylePlain;
    localizationController.languageListView.autoresizingMask = ADViewAutoresizingFlexibleWidth | ADViewAutoresizingFlexibleHeight;
    localizationController.languageListView.position = new ADPoint(0, 0);
    localizationController.languageView.addSubview(localizationController.languageListView);
    localizationController.languageListView.dataSource = localizationController;
    localizationController.languageListView.delegate = localizationController;
    localizationController.languageListView.reloadData();
    return localizationController.languageView
};
localizationController.numberOfSectionsInTableView = function(a) {
    return 1
};
localizationController.tableViewNumberOfRowsInSection = function(a, b) {
    return this.supportedLanguagesCount
};
localizationController.tableViewCellForRowAtPath = function(b, c) {
    var a = new ADTableViewCell();
    var e = 0;
    for (var d in this.supportedLanguages) {
        if (e == c.row) {
            a.text = this.supportedLanguages[d];
            break
        }
        e++
    }
    return a
};
localizationController.tableViewDidSelectRowAtPath = function(a, d) {
    var c = 0;
    for (var b in this.supportedLanguages) {
        if (c == d.row) {
            var e = b;
            break
        }
        c++
    }
    document.location = "?lang=" + e
};
localizationController.initializeUIElements = function() {
    localizationController.uiElements = eval({
        bg: {
            Search: "Търси",
            Cancel: "Откажи",
            "Change Language": "Промени език",
            "Loading...": "Зареждане...",
        },
        cs: {
            Search: "Hledat",
            Cancel: "Zrušit",
            "Change Language": "Změnit jazyk",
            "Loading...": "Načítání…",
        },
        da: {
            Search: "Søg",
            Cancel: "Annuller",
            "Change Language": "Skift sprog",
            "Loading...": "Indlæser...",
        },
        de: {
            Search: "Suchen",
            Cancel: "Abbrechen",
            "Change Language": "Sprache wechseln",
            "Loading...": "Laden ...",
        },
        el: {
            Search: "Αναζήτηση",
            Cancel: "Ακύρωση",
            "Change Language": "Αλλαγή γλώσσας",
            "Loading...": "Φόρτωση...",
        },
        en: {
            Search: "Search",
            Cancel: "Cancel",
            "Change Language": "Change Language",
            "Loading...": "Loading..."
        },
        es: {
            Search: "Buscar",
            Cancel: "Cancelar",
            "Change Language": "Cambiar idioma",
            "Loading...": "Cargando...",
        },
        et: {
            Search: "Otsi",
            Cancel: "Tühista",
            "Change Language": "Muuda keelt",
            "Loading...": "Laadimine...",
        },
        fi: {
            Search: "Etsi",
            Cancel: "Kumoa",
            "Change Language": "Vaihda kieli",
            "Loading...": "Ladataan...",
        },
        fr: {
            Search: "Rechercher",
            Cancel: "Annuler",
            "Change Language": "Changer de langue",
            "Loading...": "Chargement...",
        },
        hr: {
            Search: "Traži",
            Cancel: "Poništi",
            "Change Language": "Promijeni jezik",
            "Loading...": "Učitavanje...",
        },
        hu: {
            Search: "Keresd",
            Cancel: "Mégsem",
            "Change Language": "Válts nyelvet",
            "Loading...": "Betöltés...",
        },
        id: {
            Search: "Cari",
            Cancel: "Batalkan",
            "Change Language": "Ganti Bahasa",
            "Loading...": "Memuat...",
        },
        it: {
            Search: "Cerca",
            Cancel: "Annulla",
            "Change Language": "Cambia lingua",
            "Loading...": "Carico...",
        },
        ja: {
            Search: "検索",
            Cancel: "キャンセル",
            "Change Language": "言語を変更",
            "Loading...": "読み込み中...",
        },
        ko: {
            Search: "검색",
            Cancel: "취소",
            "Change Language": "언어 변경",
            "Loading...": "로드 중...",
        },
        lt: {
            Search: "Ieškoti",
            Cancel: "Atšaukti",
            "Change Language": "Pakeisti kalbą",
            "Loading...": "Įkeliama...",
        },
        lv: {
            Search: "Meklēt",
            Cancel: "Atcelt",
            "Change Language": "Mainīt valodu",
            "Loading...": "Notiek ielāde...",
        },
        me: {
            Search: "Traži",
            Cancel: "Odustani",
            "Change Language": "Promjena jezika",
            "Loading...": "Učitavanje...",
        },
        mk: {
            Search: "Пребарај",
            Cancel: "Откажи",
            "Change Language": "Промени јазик",
            "Loading...": "Вчитување...",
        },
        my: {
            Search: "Cari",
            Cancel: "Batal",
            "Change Language": "Tukar Bahasa",
            "Loading...": "Memuat...",
        },
        nl: {
            Search: "Zoek",
            Cancel: "Annuleer",
            "Change Language": "Wijzig taal",
            "Loading...": "Laden...",
        },
        no: {
            Search: "Søk",
            Cancel: "Avbryt",
            "Change Language": "Endre språk",
            "Loading...": "Laster inn...",
        },
        pl: {
            Search: "Szukaj",
            Cancel: "Anuluj",
            "Change Language": "Zmień język",
            "Loading...": "Wczytuję...",
        },
        pt: {
            Search: "Pesquisar",
            Cancel: "Cancelar",
            "Change Language": "Alterar idioma",
            "Loading...": "A carregar...",
        },
        pt_BR: {
            Search: "Pesquisar",
            Cancel: "Cancelar",
            "Change Language": "Alterar idioma",
            "Loading...": "A carregar...",
        },
        ro: {
            Search: "Căutare",
            Cancel: "Anulare",
            "Change Language": "Schimbare limbă",
            "Loading...": "Încărcare...",
        },
        ru: {
            Search: "Искать",
            Cancel: "Отменить",
            "Change Language": "Изменить язык",
            "Loading...": "Загрузка...",
        },
        sk: {
            Search: "Vyhľadať",
            Cancel: "Zrušiť",
            "Change Language": "Zmeniť jazyk",
            "Loading...": "Načítava sa…",
        },
        sv: {
            Search: "Sök",
            Cancel: "Avbryt",
            "Change Language": "Byt språk",
            "Loading...": "Läser in...",
        },
        th: {
            Search: "ค้นหา",
            Cancel: "ยกเลิก",
            "Change Language": "เปลี่ยนภาษา",
            "Loading...": "กำลังโหลด...",
        },
        tr: {
            Search: "Ara",
            Cancel: "Vazgeç",
            "Change Language": "Dili Değiştir",
            "Loading...": "Yükleniyor...",
        },
        vi: {
            Search: "Tìm kiếm",
            Cancel: "Hủy",
            "Change Language": "Thay đổi Ngôn ngữ",
            "Loading...": "Đang tải...",
        },
        zh_CN: {
            Search: "搜索",
            Cancel: "取消",
            "Change Language": "更改语言",
            "Loading...": "正在载入…",
        },
        zn_TW: {
            Search: "搜尋",
            Cancel: "取消",
            "Change Language": "更改語言",
            "Loading...": "正在載入⋯",
        },
    })
};
var searchController = {
    searchDelay: null,
};
searchController.getSearchItem = function() {
    if (dataController.shouldHideSearchButton) {
        return null
    }
    if (!this.searchItem) {
        this.searchBar = new ADSearchBar();
        this.searchBar.text = "";
        this.searchBar.delegate = searchController;
        this.searchItem = new ADBarButtonItem(ADBarButtonItemTypePlain);
        this.searchItem.customView = this.searchBar;
        this.resizeSearchField()
    }
    return this.searchItem
};
searchController.resizeSearchField = function() {
    if (!this.searchItem) {
        return
    }
    switch (window.orientation) {
    case 0:
    case 180:
        this.searchItem.width = 116;
        break;
    case 90:
    case - 90: this.searchItem.width = 180;
        break;
    default:
        this.searchItem.width = 200;
        break
    }
};
searchController.numberOfSectionsInTableView = function(a) {
    return 1
};
searchController.tableViewNumberOfRowsInSection = function(a, b) {
    return a._searchResultsArray.length
};
searchController.tableViewCellForRowAtPath = function(b, c) {
    var e = b._searchResultsArray[c.row];
    var d = dataController.getTitleForItemWithAPDID(e);
    var a = new ADTableViewCell(ADTableViewCellStyleSubtitle);
    a.text = d;
    a.detailedText = dataController.getBreadcrumbsForItemWithAPDID(e);
    a.accessoryType = ADTableViewCellAccessoryDisclosureIndicator;
    return a
};
searchController.tableViewDidSelectAccessoryForRowAtPath = function(a, b) {
    searchController.tableViewDidSelectRowAtPath(a, b)
};
searchController.tableViewDidSelectRowAtPath = function(a, b) {
    var c = a._searchResultsArray[b.row];
    if (!c) {
        return
    }
    this.searchBar.editing = false;
    this.searchBar.text = "";
    setTimeout(function() {
        a.deselectRowAtPathAnimated(b, false)
    },
    ADTransitionDefaults.duration * 1000);
    controller.navigateToElement(c, false)
};
searchController.searchBarTextDidChange = function(e, d) {
    if ("" == d) {
        return
    }
    var b = controller.rightNavigationController.topViewController;
    var c = null;
    if (true == b._isSearchResults) {
        c = b
    } else {
        c = new ADViewController();
        c.view = new ADView();
        c._isSearchResults = true;
        c.title = localizationController.localizedUIString("Search");
        var a = new ADTableView();
        a.autoresizingMask = ADViewAutoresizingFlexibleWidth | ADViewAutoresizingFlexibleHeight;
        a.style = ADTableViewStylePlain;
        a.dataSource = this;
        a.delegate = this;
        c.view.addSubview(a);
        c._searchResultsList = a;
        c._searchResultsList._searchResultsArray = [];
        a.reloadData();
        c.navigationItem.rightBarButtonItem = searchController.getSearchItem();
        controller.showSearchResultsView(c)
    }
    clearTimeout(this.searchDelay);
    this.searchDelay = setTimeout(function() {
        dataController.performSearchWithQuery(d, searchController.didPerformSearch)
    },
    1000)
};
searchController.didPerformSearch = function(b) {
    var a = controller.rightNavigationController.topViewController;
    if (true == a._isSearchResults) {
        a._searchResultsList._searchResultsArray = b;
        a._searchResultsList.reloadData();
        a._searchResultsList.setContentOffsetWithAnimation(new ADPoint(0, 0), false)
    }
};
searchController.searchBarTextDidBeginEditing = function(a) {
    scrollTo(0, 0)
};
var buildVersion = "1387";