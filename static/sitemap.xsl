<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:s="http://www.sitemaps.org/schemas/sitemap/0.9"
  exclude-result-prefixes="s">

  <xsl:output method="html" encoding="UTF-8" indent="yes"/>

  <xsl:template match="/">
    <html lang="en">
      <head>
        <meta charset="UTF-8"/>
        <title>Sitemap</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            margin: 32px;
            color: #111827;
            background: #f9fafb;
          }
          h1 {
            margin: 0 0 8px;
            font-size: 24px;
          }
          p {
            margin: 0 0 20px;
            color: #6b7280;
          }
          table {
            border-collapse: collapse;
            width: 100%;
            background: #ffffff;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            overflow: hidden;
          }
          th, td {
            text-align: left;
            padding: 10px 12px;
            border-bottom: 1px solid #f3f4f6;
            vertical-align: top;
          }
          th {
            background: #f3f4f6;
            color: #111827;
            font-weight: 600;
          }
          tr:last-child td {
            border-bottom: none;
          }
          a {
            color: #2563eb;
            text-decoration: none;
          }
          a:hover {
            text-decoration: underline;
          }
          .muted {
            color: #6b7280;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <xsl:choose>
          <xsl:when test="s:sitemapindex">
            <h1>Sitemap Index</h1>
            <p>Entry type: sitemapindex</p>
            <table>
              <thead>
                <tr>
                  <th>Location</th>
                  <th>Last Modified</th>
                </tr>
              </thead>
              <tbody>
                <xsl:for-each select="s:sitemapindex/s:sitemap">
                  <tr>
                    <td>
                      <a href="{s:loc}">
                        <xsl:value-of select="s:loc"/>
                      </a>
                    </td>
                    <td>
                      <xsl:choose>
                        <xsl:when test="s:lastmod">
                          <xsl:value-of select="s:lastmod"/>
                        </xsl:when>
                        <xsl:otherwise>
                          <span class="muted">N/A</span>
                        </xsl:otherwise>
                      </xsl:choose>
                    </td>
                  </tr>
                </xsl:for-each>
              </tbody>
            </table>
          </xsl:when>
          <xsl:otherwise>
            <h1>URL Sitemap</h1>
            <p>Entry type: urlset</p>
            <table>
              <thead>
                <tr>
                  <th>Location</th>
                  <th>Last Modified</th>
                  <th>Change Frequency</th>
                  <th>Priority</th>
                </tr>
              </thead>
              <tbody>
                <xsl:for-each select="s:urlset/s:url">
                  <tr>
                    <td>
                      <a href="{s:loc}">
                        <xsl:value-of select="s:loc"/>
                      </a>
                    </td>
                    <td>
                      <xsl:choose>
                        <xsl:when test="s:lastmod">
                          <xsl:value-of select="s:lastmod"/>
                        </xsl:when>
                        <xsl:otherwise>
                          <span class="muted">N/A</span>
                        </xsl:otherwise>
                      </xsl:choose>
                    </td>
                    <td>
                      <xsl:choose>
                        <xsl:when test="s:changefreq">
                          <xsl:value-of select="s:changefreq"/>
                        </xsl:when>
                        <xsl:otherwise>
                          <span class="muted">N/A</span>
                        </xsl:otherwise>
                      </xsl:choose>
                    </td>
                    <td>
                      <xsl:choose>
                        <xsl:when test="s:priority">
                          <xsl:value-of select="s:priority"/>
                        </xsl:when>
                        <xsl:otherwise>
                          <span class="muted">N/A</span>
                        </xsl:otherwise>
                      </xsl:choose>
                    </td>
                  </tr>
                </xsl:for-each>
              </tbody>
            </table>
          </xsl:otherwise>
        </xsl:choose>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
