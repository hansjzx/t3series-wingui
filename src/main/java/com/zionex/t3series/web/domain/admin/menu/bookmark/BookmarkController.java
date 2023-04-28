package com.zionex.t3series.web.domain.admin.menu.bookmark;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.zionex.t3series.web.security.authentication.AuthenticationInfo;
import com.zionex.t3series.web.security.authentication.AuthenticationManager;
import com.zionex.t3series.web.util.ResponseMessage;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class BookmarkController {

    private final BookmarkService bookmarkService;
    private final AuthenticationManager authenticationManager;

    @PostMapping("/system/menus/bookmark")
    public ResponseEntity<ResponseMessage> saveBookmark(@RequestBody Bookmark bookmark, HttpServletRequest request) {
        AuthenticationInfo authenticationInfo = authenticationManager.getAuthenticationInfo();
        String userId = authenticationInfo.getUserId();

        Bookmark existsBookmark = bookmarkService.getBookmark(userId, bookmark.getMenuId());
        bookmark.setUserId(userId);
        if (existsBookmark != null) {
            bookmark.setId(existsBookmark.getId());
        }
        
        bookmarkService.saveBookmark(bookmark);
        return new ResponseEntity<ResponseMessage>(new ResponseMessage(HttpStatus.OK.value(), "Saved bookmark entity"), HttpStatus.OK);
    }

    @PostMapping("/system/menus/bookmarks")
    public ResponseEntity<ResponseMessage> saveBookmarks(@RequestBody List<Bookmark> bookmarks, HttpServletRequest request) {
        AuthenticationInfo authenticationInfo = authenticationManager.getAuthenticationInfo();
        String userId = authenticationInfo.getUserId();

        bookmarks.forEach(bookmark -> {
            Bookmark existsBookmark = bookmarkService.getBookmark(userId, bookmark.getMenuId());
            if (existsBookmark != null) {
                bookmark.setId(existsBookmark.getId());
            }
            bookmark.setUserId(userId);
        });

        bookmarkService.saveBookmarks(bookmarks);
        return new ResponseEntity<ResponseMessage>(new ResponseMessage(HttpStatus.OK.value(), "Inserted or updated bookmark entities"), HttpStatus.OK);
    }

}
