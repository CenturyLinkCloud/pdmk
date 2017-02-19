#!/usr/bin/perl
require 5.6.0; # Make Perl Compatibility Problems More Obvious
#---------------------------------------------------------------------#
#######################################################################
#---------------------------------------------------------------------#
# COPYRIGHT (c) 2016 CenturyLink, Inc.
# SEE LICENSE-MIT FOR LICENSE TERMS
# SEE CREDITS FOR CONTRIBUTIONS AND CREDITS FOR THIS PROJECT 
#
# Program: "perlfilepack.pl" => Perl based File Packager
#                               For Single File RESTful Service [pdmk]
#
# Author: John R B Woodworth <john.woodworth@CenturyLink.com>
#
# Support Contact: plastic@centurylink.com
#
# Created: 15 April, 2016
# Last Updated: 14 December, 2016
#
our $APPNAME = "perlfilepack.pl";
our $VERSION = "0.8.9b";
#
# NOTES:
#
# CHANGES:
#
#---------------------------------------------------------------------#
#######################################################################
#---------------------------------------------------------------------#
#                                 ___     
#            _______             /  /\                        ___     
#           /  ___  \        ___/  /  \ _                    /  /\_________
#          /  /\  )  )__    /  /  /   /__\                  /  /  \        \       
#         /  /  \/  / \_\__/__/  /   /  /\\_  ____         /  /  _/__      /\      
#        /  /___/  /  /  ____   /   /  ___  \/    \       /  / _/  _/\    /  \    
#       /  _______/  /  /\  /  /   /  /\  \___/)  /\___  /  /_/  _/\\ \  /    \  
#      /  /\      \ /  /  \/  /   /  /  \__\__/  /  \  \/      _/\\ \\/ /      \
#     /  /  \______/   (__/  /   /  /   /    /  /   / //  _   /\\ \\/  /       /       
#    /  /   /      (________/   /__/   /    /__/   / //  / \  \ \\/   /       /       
#   /__/   /       /\       \  /\  \  /     \  \  / //__/   \__\/    /       /       
#   \  \  /       / /\_______\/ /\__\/       \__\/ /  \ \  / \  \   /       /       
#  / \__\/       / /           /__________________/  / \_\/   \__\ /       /       
# /             / \___________/ \=                \ /____________ /       /       
# \____________/   \=         \  \==               \ \=           \      /
#  \=          \    \==        \  \===              \ \==          \    /  
#   \==         \    \===       \  \====_____________\/\===         \  /    
#    \===        \  / \====______\/                     \====________\/
#     \====_______\/
#
#---------------------------------------------------------------------#
#
use strict;
use HTTP::Date;
use File::Type;
use File::Temp qw( tempfile tempdir );
use MIME::Base64;
use Compress::Zlib;

my $DEBUG = 1;
my $typer = File::Type->new();
my (@DIRLIST) = (@ARGV);

deflateInit( -Level => Z_BEST_COMPRESSION ); # Set deflate options
my ($tfh, $tfile) = tempfile();
print {$tfh} "sub _initResources {\n";
print {$tfh} "    (%_RES) = (\n";
foreach my $dir (@DIRLIST) {
	$dir =~ s#/*$##;
	my ($fh) = ();
	opendir ($fh, $dir) || do {
		print STDERR "Unable to open directory '${dir}' $!\n" if ($DEBUG);
	};
	&scanDir($dir, $fh);
	close ($fh);
}
print {$tfh} "    );\n";
print {$tfh} "}\n";
close($tfh);
print STDERR "TFN: '${tfile}'\n";

sub scanDir {
	my $dir = shift;
	my $fh = shift;
	while (my $filename = readdir ($fh)) {
		next if ($filename =~ /^[.]{1,2}$/); # Skip parent/ self refs
		if (-d "${dir}/${filename}") {
			my ($cfh) = ();
			opendir ($cfh, "${dir}/${filename}") || do {
				print STDERR "Unable to open directory '${dir}/${filename}' $!\n" if ($DEBUG);
			};
			&scanDir("${dir}/${filename}", $cfh);
		} else {
			my $mime = $typer->mime_type("${dir}/${filename}");
			if ($filename =~ /\.js$/) {
				$mime = 'text/javascript';
			} elsif ($filename =~ /\.html$/) {
				$mime = 'text/html';
			} elsif ($filename =~ /\.css$/) {
				$mime = 'text/css';
			}
			print STDERR "FN: ${mime} => '${dir}/${filename}'\n";
			open (FILE, "<", "${dir}/${filename}") || do {
				print STDERR "Unable to open file '${dir}/${filename}' $!\n" if ($DEBUG);
			};
			binmode (FILE);
			my $fcontents = '';
			while (sysread (FILE, my $buffer, 8192)) {
				$fcontents .= $buffer;
			}
			close (FILE);
			my (@fdata) =  (split (/\n+/s, encode_base64(Compress::Zlib::memGzip($fcontents))));
			my $lastModified = time2str((stat("${dir}/${filename}"))[9]);
			print {$tfh} "    '${dir}/${filename}' => [\n";
			print {$tfh} "        { 'Content-Type' => '${mime}', 'Content-Encoding' => 'gzip', #->\n";
			print {$tfh} "          'Last-Modified' => '${lastModified}' }, \n";
			while (scalar (@fdata)) {
				my $line = shift(@fdata);
				my $lend = (scalar (@fdata)) ? '. #->' : '';
				print {$tfh} "        '${line}'${lend}\n";
			}
			print {$tfh} "    ], \n";
		}
	}
}

